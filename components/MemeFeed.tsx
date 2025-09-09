"use client";

import React, { useState, useEffect } from 'react';
import { MemeCard } from './MemeCard';
import { supabase } from '../lib/supabase';
import { Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Meme {
  id: string;
  title: string;
  image_url: string;
  vote_count: number;
  created_at: string;
  user_id: string;
  user_email?: string;
}

export function MemeFeed() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchMemes = async () => {
    try {
      // First get memes
      const { data: memesData, error: memesError } = await supabase
        .from('memes')
        .select('*')
        .order('created_at', { ascending: false });

      if (memesError) throw memesError;

      const memesWithUsers = await Promise.all(
        (memesData || []).map(async (meme) => {
          if (meme.user_id) {
            const { data: userData } = await supabase.auth.admin.getUserById(meme.user_id);
            return {
              ...meme,
              user_email: userData.user?.email || 'Anonymous'
            };
          }
          return {
            ...meme,
            user_email: 'Anonymous'
          };
        })
      );

      setMemes(memesWithUsers);

      if (user) {
        const { data: votesData } = await supabase
          .from('votes')
          .select('meme_id, vote_type')
          .eq('user_id', user.id);

        const votesMap: Record<string, 'up' | 'down'> = {};
        votesData?.forEach(vote => {
          votesMap[vote.meme_id] = vote.vote_type;
        });
        setUserVotes(votesMap);
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMemes();
  };

  useEffect(() => {
    fetchMemes();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('memes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'memes' },
        () => {
          fetchMemes();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          fetchMemes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto text-purple-600 animate-spin mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading awesome memes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Meme Feed</h1>
            <p className="text-gray-600 mt-1">Discover and vote on the best memes</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-purple-600"
          >
            <RefreshCw className={`${refreshing ? 'animate-spin' : ''}`} size={18} />
            <span>Refresh</span>
          </button>
        </div>

        {memes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No memes yet</h3>
            <p className="text-gray-600">Be the first to share a meme with the community!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memes.map((meme) => (
              <MemeCard
                key={meme.id}
                id={meme.id}
                title={meme.title}
                image_url={meme.image_url}
                vote_count={meme.vote_count}
                created_at={meme.created_at}
                user_email={meme.user_email}
                userVote={userVotes[meme.id] || null}
                onVoteChange={fetchMemes}
                // onDelete={fetchMemes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}