begin;

create table public.recipe_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null check (char_length(recipe_id) between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

alter table public.recipe_saves enable row level security;
revoke all on public.recipe_saves from anon, authenticated;
grant select, insert, update, delete on public.recipe_saves to authenticated;

create policy saves_select on public.recipe_saves for select to authenticated
  using ((select auth.uid()) = user_id);
create policy saves_insert on public.recipe_saves for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy saves_update on public.recipe_saves for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy saves_delete on public.recipe_saves for delete to authenticated
  using ((select auth.uid()) = user_id);

commit;
