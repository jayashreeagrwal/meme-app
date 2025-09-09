"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeaderboardMeme {
  id: string;
  title: string;
  image_url: string;
  vote_count: number;
  created_at: string;
  user_id: string;
  user_email?: string;
}

export function Leaderboard() {
  const [topMemes, setTopMemes] = useState<LeaderboardMeme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMemes = async () => {
      try {
        // First get top memes
        const { data: memesData, error: memesError } = await supabase
          .from('memes')
          .select('*')
          .order('vote_count', { ascending: false })
          .limit(5);

        if (memesError) throw memesError;

        // Get user emails for each meme
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

        setTopMemes(memesWithUsers);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMemes();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'memes' },
        () => {
          fetchTopMemes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="text-yellow-500" size={32} />;
      case 2:
        return <Medal className="text-gray-400" size={28} />;
      case 3:
        return <Award className="text-orange-500" size={24} />;
      default:
        return <Star className="text-purple-500" size={20} />;
    }
  };

  const getRankColors = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="mx-auto text-purple-600 animate-pulse mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Meme Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">The top 5 memes with the highest net votes</p>
        </div>

        {topMemes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Trophy className="mx-auto h-24 w-24" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No memes ranked yet</h3>
            <p className="text-gray-600">Upload and vote on memes to see them on the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {topMemes.map((meme, index) => {
              const position = index + 1;
              return (
                <div
                  key={meme.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
                    position === 1 ? 'ring-4 ring-yellow-200' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/3">
                      <div className={`absolute top-4 left-4 z-10 w-12 h-12 rounded-full ${getRankColors(position)} flex items-center justify-center font-bold text-lg shadow-lg`}>
                        #{position}
                      </div>
                      <div className="absolute top-4 right-4 z-10">
                        {getRankIcon(position)}
                      </div>
                      <img
                        src={meme.image_url}
                        alt={meme.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          {meme.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-gray-600">
                          <span>By {meme.user_email || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{new Date(meme.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center px-6 py-3 rounded-full font-bold text-lg ${
                          meme.vote_count > 0 ? 'bg-green-100 text-green-700' :
                          meme.vote_count < 0 ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          <Trophy className="mr-2" size={20} />
                          {meme.vote_count > 0 ? '+' : ''}{meme.vote_count} votes
                        </div>
                        
                        {position <= 3 && (
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">Achievement</div>
                            <div className="font-semibold text-gray-800">
                              {position === 1 ? '🥇 Meme Champion' : 
                               position === 2 ? '🥈 Runner Up' : 
                               '🥉 Bronze Medal'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}