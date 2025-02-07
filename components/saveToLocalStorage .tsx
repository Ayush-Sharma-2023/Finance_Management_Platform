// Save data to localStorage
const saveToLocalStorage = () => {
  // Calculate total expenses from all categories
  const totalExpense = categories.reduce((total, category) => total + (parseFloat(category.amount) || 0), 0);

  // Calculate final income (consider any deductions or other logic here if necessary)
  const finalIncome = parseFloat(salary) || 0;

  // Calculate monthly income (final income / 12)
  const monthlyIncome = finalIncome / 12;

  // Calculate remaining budget (monthly income - total expense)
  const remainingBudget = monthlyIncome - totalExpense;

  // Prepare the data to save
  const budgetData = {
    salary: salary,
    categories: categories,
    savingsGoal: savingsGoal,
    finalIncome: finalIncome,
    monthlyIncome: monthlyIncome,
    totalExpense: totalExpense,
    remainingBudget: remainingBudget,
  };

  // Save the data to localStorage
  try {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    alert('Budget data saved successfully!');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    alert('Failed to save data.');
  }
};
