import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App.tsx', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should display all main components', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /todo list/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument();
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('should add a new todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'Buy groceries');
    await user.click(addButton);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('should toggle a todo completion status', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'Buy groceries');
    await user.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('should delete a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'Buy groceries');
    await user.click(addButton);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /delete todo/i });
    await user.click(deleteButton);

    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
  });

  it('should filter active todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Add two todos
    await user.type(input, 'Active todo');
    await user.click(addButton);
    await user.type(input, 'Completed todo');
    await user.click(addButton);

    // Complete the second todo
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    // Switch to Active filter
    const activeButton = screen.getByRole('button', { name: /active/i });
    await user.click(activeButton);

    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
  });

  it('should highlight the active filter button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const allButton = screen.getByRole('button', { name: /all/i });
    const activeButton = screen.getByRole('button', { name: /active/i });

    expect(allButton).toHaveClass('active');
    expect(activeButton).not.toHaveClass('active');

    await user.click(activeButton);

    expect(allButton).not.toHaveClass('active');
    expect(activeButton).toHaveClass('active');
  });
});
