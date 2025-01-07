CREATE OR REPLACE FUNCTION increment_token_balance(user_id uuid, amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE token_wallets 
  SET 
    balance = balance + amount,
    total_earned = total_earned + amount
  WHERE user_id = increment_token_balance.user_id;
END;
$$;