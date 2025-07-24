import { supabase } from '../lib/supabase'

export interface MindMapNode {
  id: string
  x: number
  y: number
  text: string
  type: 'central' | 'idea'
}

export interface MindMap {
  id: string
  title: string
  nodes: MindMapNode[]
  created_at: string
  updated_at: string
  user_id: string
}

export const mindMapService = {
  // Get all mind maps for the current user
  async getUserMindMaps(): Promise<MindMap[]> {
    const { data, error } = await supabase
      .from('mind_maps')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Supabase error getting mind maps:', error)
      throw error
    }

    console.log('Supabase returned mind maps:', data)
    return data || []
  },

  // Get a single mind map by ID
  async getMindMap(id: string): Promise<MindMap | null> {
    const { data, error } = await supabase
      .from('mind_maps')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data
  },

  // Create a new mind map
  async createMindMap(title: string, nodes: MindMapNode[]): Promise<MindMap> {
    const user = (await supabase.auth.getUser()).data.user
    console.log('Creating mind map for user:', user?.id)
    
    const { data, error } = await supabase
      .from('mind_maps')
      .insert({
        title,
        nodes,
        user_id: user?.id
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating mind map:', error)
      throw error
    }

    console.log('Successfully created mind map:', data)
    return data
  },

  // Update an existing mind map
  async updateMindMap(id: string, title: string, nodes: MindMapNode[]): Promise<MindMap> {
    const { data, error } = await supabase
      .from('mind_maps')
      .update({
        title,
        nodes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  },

  // Delete a mind map
  async deleteMindMap(id: string): Promise<void> {
    const { error } = await supabase
      .from('mind_maps')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }
} 