/*
  # Add helper function for incrementing MC stats

  ## New Functions
  
  ### `increment_mc_stats`
  Helper function to safely increment vitorias or derrotas for an MC.
  Used when registering battle results.
  
  Parameters:
  - mc_id (uuid): The MC to update
  - stat (text): Either 'vitorias' or 'derrotas'
*/

CREATE OR REPLACE FUNCTION increment_mc_stats(mc_id uuid, stat text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF stat = 'vitorias' THEN
    UPDATE mcs SET vitorias = vitorias + 1 WHERE id = mc_id;
  ELSIF stat = 'derrotas' THEN
    UPDATE mcs SET derrotas = derrotas + 1 WHERE id = mc_id;
  END IF;
END;
$$;