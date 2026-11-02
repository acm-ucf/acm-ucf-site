"use client";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

type MembershipType = "yearly" | "semesterly";

interface MembershipFormData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  major?: string;
  graduationYear?: string;
}

interface PayPalComponentProps {
  formData: MembershipFormData;
  membershipType: MembershipType;
  amount: number;
  description: string;
  onError: (message: string) => void;
}

interface ButtonWrapperProps {
  showSpinner: boolean;
  formData: MembershipFormData;
  membershipType: MembershipType;
  amount: number;
  description: string;
  onError: (message: string) => void;
}

const ButtonWrapper = ({
  showSpinner,
  formData,
  membershipType,
  amount,
  description,
  onError,
}: ButtonWrapperProps) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const router = useRouter();

  const createOrder = async () => {
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }
      return data.id;
    } catch (error) {
      console.error("Error creating order:", error);
      onError("Failed to create PayPal order. Please try again.");
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
          userData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            studentId: formData.studentId,
            major: formData.major || null,
            graduationYear: formData.graduationYear || null,
          },
          membershipType,
        }),
      });

      const captureData = await response.json();

      if (!response.ok) {
        throw new Error(captureData.error || "Failed to capture payment");
      }

      if (captureData.status === "success") {
        const params = new URLSearchParams({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          type: membershipType,
          amount: amount.toString(),
        });
        router.push(`/get-involved/membership/success?${params.toString()}`);
      } else {
        throw new Error("Payment was not completed successfully");
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      onError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again."
      );
    }
  };

  const onPayPalError = (err: Record<string, unknown>) => {
    console.error("PayPal error:", err);
    onError("An error occurred with PayPal. Please try again.");
  };

  const onCancel = () => {
    onError("Payment was cancelled. You can try again when ready.");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {showSpinner && isPending && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "rect" }}
        disabled={false}
        forceReRender={[formData, membershipType, amount]}
        fundingSource={undefined}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onPayPalError}
        onCancel={onCancel}
      />
    </div>
  );
};

function PayPalComponent({
  formData,
  membershipType,
  amount,
  description,
  onError,
}: PayPalComponentProps) {

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_PAYPAL_CLIENT_ID is not defined");
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        currency: "USD",
        disableFunding: "paylater,credit",
      }}
    >
      <ButtonWrapper
        showSpinner={true}
        formData={formData}
        membershipType={membershipType}
        amount={amount}
        description={description}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalComponent;
