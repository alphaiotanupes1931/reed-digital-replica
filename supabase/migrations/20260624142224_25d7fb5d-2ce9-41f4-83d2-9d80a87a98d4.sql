
ALTER FUNCTION public.gen_accountant_id() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.connect_accountant_by_id(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_my_accountant(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.connect_accountant_by_id(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_my_accountant(text) TO authenticated;
