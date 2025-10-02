export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

// Source of truth for all subscription plans
export const PRODUCTS: Product[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Para quem recebe poucos áudios por semana e quer experimentar a praticidade da transcrição com IA.",
    priceInCents: 1999, // R$ 19.99
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para usuários que precisam de mais capacidade e recursos avançados de transcrição.",
    priceInCents: 4999, // R$ 49.99
  },
  {
    id: "business",
    name: "Business",
    description: "Solução completa para equipes e empresas com alto volume de áudios.",
    priceInCents: 9999, // R$ 99.99
  },
]
