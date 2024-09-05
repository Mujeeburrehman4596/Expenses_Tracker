document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const budgetForm = document.getElementById('budget-form');
    const expenseList = document.getElementById('expense-list');
    const expenseSummary = document.getElementById('expense-summary');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let budget = parseFloat(localStorage.getItem('budget')) || 0;

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                ${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})
                <button class="btn btn-warning btn-sm float-right ml-2 edit-expense" data-index="${index}">Edit</button>
                <button class="btn btn-danger btn-sm float-right delete-expense" data-index="${index}">Delete</button>
            `;
            expenseList.appendChild(li);
        });
        renderSummary();
    }

    function renderSummary() {
        const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remainingBudget = budget - totalExpense;
        expenseSummary.innerHTML = `
            <h4>Summary</h4>
            <p>Total Expense: $${totalExpense.toFixed(2)}</p>
            <p>Monthly Budget: $${budget.toFixed(2)}</p>
            <p>Remaining Budget: $${remainingBudget.toFixed(2)}</p>
            <p>Status: ${remainingBudget >= 0 ? 'Within Budget' : 'Over Budget'}</p>
        `;
    }

    function saveData() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('budget', budget);
    }

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        expenses.push({ name, amount, category });
        saveData();
        renderExpenses();
        expenseForm.reset();
    });

    budgetForm.addEventListener('submit', function (e) {
        e.preventDefault();
        budget = parseFloat(document.getElementById('budget-amount').value);
        saveData();
        renderSummary();
    });

    expenseList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-expense')) {
            const index = e.target.getAttribute('data-index');
            expenses.splice(index, 1);
            saveData();
            renderExpenses();
        } else if (e.target.classList.contains('edit-expense')) {
            const index = e.target.getAttribute('data-index');
            const expense = expenses[index];
            document.getElementById('expense-name').value = expense.name;
            document.getElementById('expense-amount').value = expense.amount;
            document.getElementById('expense-category').value = expense.category;
            expenses.splice(index, 1);
            saveData();
            renderExpenses();
        }
    });

    // Initial rendering
    renderExpenses();
    renderSummary();
});
