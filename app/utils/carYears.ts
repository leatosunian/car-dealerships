export const carYears = Array.from(
    { length: new Date().getFullYear() - 1970 + 1 },
    (_, i) => (1970 + i).toString()
);