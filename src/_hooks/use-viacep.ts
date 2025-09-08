import { useState, useCallback } from "react";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const useViaCep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddressByCep = useCallback(
    async (cep: string): Promise<AddressData | null> => {
      // Remove non-numeric characters
      const cleanCep = cep.replace(/\D/g, "");

      // Validate CEP format (should be 8 digits)
      if (cleanCep.length !== 8) {
        setError("CEP deve ter 8 dígitos");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
        );

        if (!response.ok) {
          throw new Error("Erro ao consultar CEP");
        }

        const data: ViaCepResponse = await response.json();

        if (data.erro) {
          setError("CEP não encontrado");
          return null;
        }

        return {
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    fetchAddressByCep,
    isLoading,
    error,
  };
};
