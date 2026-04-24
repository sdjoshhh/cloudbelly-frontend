import { Client } from "@gradio/client";
import { BsLightningChargeFill } from "react-icons/bs";

const client = await Client.connect("a13awd/avg-grid-predictions");

const dateStart = '2026-04-10'
const dateEnd = '2026-04-19'

export async function getElecPrice(state) {
  const res = await client.predict("//load_daily_averages", { 		
    state: state, 		
    start_date: dateStart, 		
    end_date: dateEnd, 
  });
  const table = res.data[0];
  const parsedRes = parseRes(table.data);
  return parsedRes
}

export function parseRes(rows) {
  const prices = rows.map((row) => ({
    date: row[0],
    avgPrice: row[1],
    avgDemand: row[2],
    source: row[3],
  }));
  return prices
}

export const ELEC_MODES = [
  { key: 'price',  icon: <BsLightningChargeFill />,  title: 'Electricity price'  },
];
