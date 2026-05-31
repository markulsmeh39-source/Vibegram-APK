-- Создаем или заменяем функцию для обхода RLS и каскадного удаления пользователя из системы аутентификации

CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 1. Проверяем, является ли вызывающий функцию (auth.uid()) администратором "Создателем" (is_admin()).
    -- Для безопасности можно проверять напрямую или просто опираться на то, что только админы смогут ее дернуть.
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- 2. Удаляем пользователя из auth.users - это каскадно удалит профиль и все связанные данные.
    -- Это нужно выполнять от имени суперпользователя базы (SECURITY DEFINER дает такие права, если владелец - supabase_admin).
    DELETE FROM auth.users WHERE id = target_user_id;

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Error deleting user: %', SQLERRM;
END;
$$;

-- Сначала изменим таблицу vib_transfers, чтобы каскадно обновлять при удалении пользователей
ALTER TABLE public.vib_transfers
  DROP CONSTRAINT IF EXISTS vib_transfers_sender_id_fkey,
  DROP CONSTRAINT IF EXISTS vib_transfers_receiver_id_fkey;

ALTER TABLE public.vib_transfers
  ADD CONSTRAINT vib_transfers_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT vib_transfers_receiver_id_fkey 
  FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
