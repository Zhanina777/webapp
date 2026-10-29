-- Run once in your CRYST project's SQL Editor.
begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 40),
  created_at timestamptz not null default now()
);

create table public.recipe_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null check (char_length(recipe_id) between 1 and 100),
  current_step integer not null default 1 check (current_step between 1 and 100),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

alter table public.profiles enable row level security;
alter table public.recipe_progress enable row level security;
revoke all on public.profiles, public.recipe_progress from anon, authenticated;
grant select, insert, update, delete on public.profiles, public.recipe_progress to authenticated;

create policy profiles_select on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy profiles_delete on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create policy progress_select on public.recipe_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy progress_insert on public.recipe_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy progress_update on public.recipe_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy progress_delete on public.recipe_progress for delete to authenticated using ((select auth.uid()) = user_id);

create function public.set_progress_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger progress_updated_at before update on public.recipe_progress
for each row execute function public.set_progress_updated_at();

commit;
