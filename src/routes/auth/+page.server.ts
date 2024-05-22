import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
  oauth: async ({ request, locals: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: '/auth/callback',
      },
    });

    if (data.url) {
      redirect(303, data.url);
    }
  },
}