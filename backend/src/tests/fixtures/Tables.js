import Table from "../../models/Table.js";

let tableCounter = 0;

export const createTestTable = async (overrides = {}) => {
  tableCounter += 1;
  const table = new Table({
    number: tableCounter,
    capacity: 4,
    status: "active",
    ...overrides,
  });
  return table.save();
};
