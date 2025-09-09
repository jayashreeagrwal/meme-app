"use client";

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Calendar, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/contexts/AuthContext';

interface MemeCardProps {
  id: string;
  title: string;
  image_url: string;
  vote_count: number;
  created_at: string;
  user_email?: string;
  userVote?: 'up' | 'down' | null;
  onVoteChange: () => void;
}

export function MemeCard({
  id,
  title,
  image_url,
  vote_count,
  created_at,
  user_email,
  userVote,
  onVoteChange,
}: MemeCardProps) {
  const { user } = useAuth();
  const [voting, setVoting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    setVoting(true);

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('meme_id', id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking same vote type
          await supabase.from('votes').delete().eq('id', existingVote.id);
        } else {
          // Update vote type
          await supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase.from('votes').insert({
          user_id: user.id,
          meme_id: id,
          vote_type: voteType,
        });
      }

      // Update vote count in memes table
      const { data: votes } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('meme_id', id);

      const upvotes = votes?.filter(v => v.vote_type === 'up').length || 0;
      const downvotes = votes?.filter(v => v.vote_type === 'down').length || 0;
      const netVotes = upvotes - downvotes;

      await supabase
        .from('memes')
        .update({ vote_count: netVotes })
        .eq('id', id);

      onVoteChange();
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            <User size={14} />
            <span>{user_email || 'Anonymous'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={14} />
            <span>{new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote('up')}
              disabled={voting}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                userVote === 'up'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600'
              } ${voting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronUp size={18} />
              <span className="font-medium">Up</span>
            </button>
            
            <button
              onClick={() => handleVote('down')}
              disabled={voting}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                userVote === 'down'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600'
              } ${voting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronDown size={18} />
              <span className="font-medium">Down</span>
            </button>
          </div>

          <div className={`px-3 py-2 rounded-lg font-bold ${
            vote_count > 0 ? 'bg-green-100 text-green-700' :
            vote_count < 0 ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {vote_count > 0 ? '+' : ''}{vote_count}
          </div>
        </div>
      </div>
    </div>
  );
}