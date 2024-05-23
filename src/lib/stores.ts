import { writable } from "svelte/store";

export const history = writable([] as HistoryItem[]);
export const currentEmail = writable({} as EmailMessage);