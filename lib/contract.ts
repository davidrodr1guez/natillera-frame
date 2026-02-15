import { ethers } from "ethers";
import { CELO_RPC } from "./natilleras";

const ABI = [
  "function name() view returns (string)",
  "function contributionAmount() view returns (uint256)",
  "function getCurrentRound() view returns (uint256)",
  "function status() view returns (uint8)",
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
  status: string;
  statusCode: number;
}

const provider = new ethers.JsonRpcProvider(CELO_RPC);

export async function getNatilleraData(
  address: string
): Promise<NatilleraData> {
  const contract = new ethers.Contract(address, ABI, provider);

  const [name, contributionAmount, currentRound, statusCode] =
    await Promise.all([
      contract.name() as Promise<string>,
      contract.contributionAmount() as Promise<bigint>,
      contract.getCurrentRound() as Promise<bigint>,
      contract.status() as Promise<bigint>,
    ]);

  const statusNum = Number(statusCode);

  return {
    name,
    contributionAmount: ethers.formatEther(contributionAmount),
    currentRound: Number(currentRound),
    status: STATUS_LABELS[statusNum] ?? `Desconocido (${statusNum})`,
    statusCode: statusNum,
  };
}
