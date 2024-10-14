export const calculationTotalDurationTime = (
    startDateTime: string,
    endDateTime: string,
    pricePerHour: number
  ): number => {
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);
    if (endDate <= startDate) {
      throw new Error("End time must be after start time");
    }
  
    const duration = endDate.getTime() - startDate.getTime();
    const durationInHours = duration / (1000 * 60 * 60);
  
    const totalCost = durationInHours * pricePerHour;
  
    return totalCost;
  };