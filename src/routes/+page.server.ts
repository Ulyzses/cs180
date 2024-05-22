import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async({ depends, locals: { supabase, user } }) => {
  depends('supabase:db:emails');
}