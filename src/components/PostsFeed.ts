import { supabase } from '../supabase'
import type { Post } from '../supabase'

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data || []
}

export function renderPost(post: Post, currentUserId: string): string {
  const isOwnPost = post.author_id === currentUserId
  const timeAgo = getTimeAgo(new Date(post.created_at))

  return `
    <div class="post" data-post-id="${post.id}">
      <div class="post-header">
        <div>
          <h3 class="post-title">${escapeHtml(post.title)}</h3>
          <p class="post-time">${timeAgo}</p>
        </div>
        ${!isOwnPost ? `
          <button class="contact-button" data-post-id="${post.id}" data-author-id="${post.author_id}">
            Contact
          </button>
        ` : ''}
      </div>
      <div class="post-body">${escapeHtml(post.body)}</div>
      <div class="post-footer">
        ${post.crypto_amount ? `<span class="crypto-badge">₿ ${post.crypto_amount}</span>` : ''}
        ${post.contact_info ? `<span class="contact-info">${escapeHtml(post.contact_info)}</span>` : ''}
      </div>
    </div>
  `
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
