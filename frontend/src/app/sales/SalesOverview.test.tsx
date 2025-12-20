import { render, screen, waitFor } from '@testing-library/react'
import SalesOverview from './page'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

// Mock axios
jest.mock('@/lib/axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock useRouter
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

describe('SalesOverview Component', () => {
    const mockRouter = { push: jest.fn() }

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter)
        mockedAxios.get.mockImplementation((url) => {
            if (url === 'sales/quotations/') return Promise.resolve({ data: [{}, {}] })
            if (url === 'sales/work-orders/') return Promise.resolve({ data: [{}] })
            if (url === 'sales/invoices/') return Promise.resolve({
                data: [
                    { total_amount: '1000', amount_paid: '600' },
                    { total_amount: '500', amount_paid: '500' }
                ]
            })
            return Promise.reject(new Error('not found'))
        })
    })

    it('renders the dashboard title', async () => {
        render(<SalesOverview />)
        expect(screen.getByText(/Commercial Dashboard/i)).toBeInTheDocument()
    })

    it('calculates and displays financial statistics correctly', async () => {
        render(<SalesOverview />)

        // Total Invoiced: 1500, Paid: 1100, Outstanding: 400, Rate: 73%
        expect(await screen.findByText(/\$1,?500/)).toBeInTheDocument()
        expect(await screen.findByText(/\$1,?100/)).toBeInTheDocument()
        expect(await screen.findByText(/\$400/)).toBeInTheDocument()
        expect(await screen.findByText(/73%/)).toBeInTheDocument()
    })

    it('navigates to new invoice page when button is clicked', async () => {
        render(<SalesOverview />)
        const newInvoiceBtn = screen.getByRole('button', { name: /New Invoice/i })
        newInvoiceBtn.click()
        expect(mockRouter.push).toHaveBeenCalledWith('/sales/invoices')
    })
})
