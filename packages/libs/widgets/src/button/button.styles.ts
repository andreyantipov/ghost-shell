import { defineRecipe } from '@pandacss/dev'

export const button = defineRecipe({
  className: 'button',
  base: {
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontSize: '13px',
  },
  variants: {
    variant: {
      primary: {
        background: '#0e639c',
        color: 'white',
        padding: '6px 14px',
        borderRadius: '4px',
        '&:hover': {
          background: '#1177bb'
        },
        '&:active': {
          background: '#0d5a8f'
        }
      },
      secondary: {
        background: '#3a3d41',
        color: 'white',
        padding: '6px 14px',
        borderRadius: '4px',
        '&:hover': {
          background: '#45494e'
        }
      },
      icon: {
        background: 'none',
        color: '#cccccc',
        padding: '4px',
        borderRadius: '3px',
        fontSize: '16px',
        lineHeight: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        '&:hover': {
          background: '#3a3d41'
        }
      }
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
})
