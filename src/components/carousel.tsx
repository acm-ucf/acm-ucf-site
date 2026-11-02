"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

export default function CarouselWithProgress() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const progress = (current * 100) / count;

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-5xl py-4">
      <Carousel setApi={setApi} className="w-full max-w-5xl">
        <CarouselContent className="-ml-2 md:-ml-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <Card className="border border-gray-700 bg-black/40 backdrop-blur-sm hover:border-yellow-400/50 transition-colors duration-300">
                <CardContent className="flex aspect-video items-center justify-center p-8 md:p-12">
                  <span className="text-5xl md:text-6xl font-semibold text-foreground">
                    {index + 1}
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 border-gray-700 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-yellow-400/50 transition-colors" />
        <CarouselNext className="hidden md:flex -right-12 h-12 w-12 border-gray-700 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-yellow-400/50 transition-colors" />
      </Carousel>
      <div className="flex items-center justify-center gap-4 mt-8 px-4">
        <Progress value={progress} className="flex-1 max-w-md h-2" />
        <span className="text-sm text-gray-400 font-bmono min-w-[60px] text-right">
          {current} / {count}
        </span>
      </div>
    </div>
  );
}
