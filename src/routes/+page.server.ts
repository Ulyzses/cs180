import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async({ depends, locals: { supabase, user } }) => {
  console.log("User", user?.email);
  depends('supabase:db:emails');

  const { data } = await supabase
    .from("emails")
    .select()
    .eq("email", user?.email)
    .limit(10);

  console.log("Data", data);

  return {
    emails: data ?? [],
  } as {
    emails: EmailMessage[];
  };
}