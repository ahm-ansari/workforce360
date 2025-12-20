import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
    it('renders the welcome message', () => {
        render(<Home />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toHaveTextContent(/To get started, edit the page.tsx file/i)
    })

    it('contains the Documentation link', () => {
        render(<Home />)
        const link = screen.getByRole('link', { name: /Documentation/i })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', expect.stringContaining('nextjs.org/docs'))
    })
})
