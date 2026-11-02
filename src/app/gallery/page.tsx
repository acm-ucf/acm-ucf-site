"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  tags: string[];
  date: string;
}

// TODO: replace with real gallery data once available
const mockVideos: Video[] = [
  {
    id: "1",
    title: "ACM Workshop: Introduction to React",
    thumbnail: "/placeholder-video.jpg",
    duration: "45:30",
    category: "Workshop",
    tags: ["React", "Web Development", "Tutorial"],
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "General Body Meeting - Fall 2024",
    thumbnail: "/placeholder-video.jpg",
    duration: "1:20:15",
    category: "GBM",
    tags: ["Meeting", "Announcements"],
    date: "2024-01-10",
  },
  {
    id: "3",
    title: "Hackathon 2024 Highlights",
    thumbnail: "/placeholder-video.jpg",
    duration: "15:45",
    category: "Event",
    tags: ["Hackathon", "Competition"],
    date: "2024-01-05",
  },
];

const categories = ["All", "Workshop", "GBM", "Event", "Tutorial", "Social"];
const tags = [
  "React",
  "Web Development",
  "Tutorial",
  "Meeting",
  "Announcements",
  "Hackathon",
  "Competition",
];

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedTags([]);
  };

  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch =
      searchQuery === "" ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || video.category === selectedCategory;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => video.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-catamaran font-black text-foreground mb-2">
            Video <span className="text-yellow-400">Gallery</span>
          </h1>
          <p className="text-gray-400 font-bmono">
            Browse our collection of workshops, meetings, and events
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside
            className={cn(
              "lg:w-80 shrink-0",
              "bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6",
              "h-fit lg:sticky lg:top-24",
            )}
          >
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-foreground transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="font-bmono">Filters</span>
              </button>
            </div>

            <div
              className={cn(
                "space-y-6",
                isFilterOpen ? "block" : "hidden lg:block",
              )}
            >
              <div>
                <label className="block text-sm font-bmono font-medium text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search videos..."
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-md text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 font-bmono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bmono font-medium text-gray-300 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm font-bmono transition-colors",
                        selectedCategory === category
                          ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent",
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bmono font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bmono transition-colors",
                        selectedTags.includes(tag)
                          ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10",
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {(searchQuery ||
                selectedCategory !== "All" ||
                selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-foreground text-sm font-bmono transition-colors"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 font-bmono">
                  {filteredVideos.length} video
                  {filteredVideos.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-bmono text-lg">
                  No videos found matching your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-video bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="relative z-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <svg
                            className="w-8 h-8 text-foreground ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-300 font-bmono">
                          {video.duration}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-foreground font-catamaran font-semibold text-lg line-clamp-2 group-hover:text-yellow-400 transition-colors">
                          {video.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-bmono mb-3">
                        <span className="px-2 py-1 bg-white/10 rounded">
                          {video.category}
                        </span>
                        <span>{new Date(video.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded font-bmono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
