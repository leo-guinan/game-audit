"use client";

import { use } from "react";
import Header from "@/components/header";
import { MOCK_GUESTS, getAllPodcasts } from "@/lib/mock-data/metaspn";
import { PodcastCard } from "@/components/metaspn/podcast-card";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PersonPage({ params }: PageProps) {
  const { id } = use(params);
  
  // Find person (could be guest or host)
  const guest = MOCK_GUESTS.find(g => g.id === id);
  const allPodcasts = getAllPodcasts();
  const hostPodcast = allPodcasts.find(p => p.podcast.host_name?.toLowerCase().includes(id.toLowerCase()));

  if (!guest && !hostPodcast) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
          <p className="text-muted-foreground">Person not found</p>
        </div>
      </div>
    );
  }

  const person = guest || {
    id: id,
    name: hostPodcast?.podcast.host_name || 'Unknown',
    bio: hostPodcast?.podcast.description,
    image_url: undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/discover" className="text-sm font-mono text-muted-foreground hover:text-primary mb-4 inline-block">
            ← Back to Discover
          </Link>
          
          <div className="flex gap-6 items-start">
            {person.image_url ? (
              <Image
                src={person.image_url}
                alt={person.name}
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[150px] h-[150px] bg-muted rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">
                  {person.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{person.name}</h1>
              {person.bio && (
                <p className="text-lg text-muted-foreground">{person.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Guest Profile */}
        {guest && (
          <div className="space-y-8">
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Guest Profile</h2>
              <p className="text-muted-foreground mb-4">
                This person has appeared as a guest on multiple podcasts. Guest impact analysis would appear here.
              </p>
              <div className="p-4 bg-muted/20 border border-border rounded">
                <p className="text-sm text-muted-foreground">
                  Guest impact data and statistics would be displayed here, showing how this guest affects
                  the geometry and experience of shows they appear on.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Host Profile */}
        {hostPodcast && (
          <div className="space-y-8">
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Host Profile</h2>
              <p className="text-muted-foreground mb-4">
                Podcasts hosted by {person.name}
              </p>
              
              <div className="space-y-4">
                <PodcastCard
                  podcast={hostPodcast.podcast}
                  metrics={hostPodcast.metrics}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
