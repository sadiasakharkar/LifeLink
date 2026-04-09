export const roles = ["Hospital Admin", "Doctor", "Transport Team"];
export const organs = ["Heart", "Kidney", "Liver", "Lung", "Pancreas"];
export const bloodGroups = ["O", "A", "B", "AB"];

export const requireFields = (payload, fields) => {
  const missing = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });

  return {
    valid: missing.length === 0,
    missing,
  };
};

export const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const isValidUrgency = (urgency) => Number.isInteger(urgency) && urgency >= 1 && urgency <= 10;
