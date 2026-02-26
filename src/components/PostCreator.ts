import { supabase } from '../supabase'
import { getOrCreateUserId } from '../user'

export interface PostData {
  title: string
  body: string
  crypto_amount: number | null
  contact_info: string | null
}

export async function createPost(data: PostData): Promise<boolean> {
  const userId = getOrCreateUserId()

  const { error } = await supabase
    .from('posts')
    .insert([
      {
        title: data.title,
        body: data.body,
        crypto_amount: data.crypto_amount,
        contact_info: data.contact_info,
        author_id: userId
      }
    ])

  if (error) {
    console.error('Error creating post:', error)
    return false
  }

  return true
}

export function renderPostCreator(): string {
  return `
    <div class="post-creator">
      <input
        type="text"
        id="post-title"
        placeholder="Title"
        maxlength="100"
      />
      <textarea
        id="post-body"
        placeholder="Describe your offer or request..."
        maxlength="500"
      ></textarea>
      <div class="post-creator-row">
        <input
          type="number"
          id="post-amount"
          placeholder="Crypto amount"
          step="0.00000001"
          min="0"
        />
        <input
          type="text"
          id="post-contact"
          placeholder="Contact info (email, telegram, etc)"
          maxlength="100"
        />
      </div>
      <div class="post-creator-footer">
        <button id="post-button">Post</button>
      </div>
    </div>
  `
}
