import { ethers } from "ethers";
import { CELO_RPC, NATILLERAS } from "./natilleras";

const ABI = [
  "function name() view returns (string)",
  "function contributionAmount() view returns (uint256)",
  "function getCurrentRound() view returns (uint256)",
  "function totalRounds() view returns (uint256)",
  "function status() view returns (uint8)",
  "function nextRecipient() view returns (address)",
];

const STATUS_LABELS: Record<number, string> = {
  0: "Pendiente",
  1: "Activa",
  2: "Completada",
  3: "Cancelada",
};

export interface NatilleraData {
  name: string;
  contributionAmount: string;
  currentRound: number;
  totalRounds: number;
  status: string;
  statusCode: number;
  nextRecipient: string;
}

const provider = new ethers.JsonRpcProvider(CELO_RPC);

export async function getNatilleraData(
  address: string
): Promise<NatilleraData> {
  const contract = new ethers.Contract(address, ABI, provider);

  const [name, contributionAmount, currentRound, totalRounds, statusCode, nextRecipient] =
    await Promise.all([
      contract.name() as Promise<string>,
      contract.contributionAmount() as Promise<bigint>,
      contract.getCurrentRound() as Promise<bigint>,
      contract.totalRounds() as Promise<bigint>,
      contract.status() as Promise<bigint>,
      contract.nextRecipient() as Promise<string>,
    ]);

  const statusNum = Number(statusCode);

  return {
    name,
    contributionAmount: ethers.formatEther(contributionAmount),
    currentRound: Number(currentRound),
    totalRounds: Number(totalRounds),
    status: STATUS_LABELS[statusNum] ?? `Desconocido (${statusNum})`,
    statusCode: statusNum,
    nextRecipient,
  };
}

export async function getAllNatillerasData(): Promise<NatilleraData[]> {
  const results = await Promise.allSettled(
    NATILLERAS.map((n) => getNatilleraData(n.address))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<NatilleraData> => r.status === "fulfilled")
    .map((r) => r.value);
}
