import { defineSlotRecipe } from '@pandacss/dev'

export const shell = defineSlotRecipe({
  className: 'shell',
  slots: ['root', 'header', 'headerTitle', 'actions', 'body', 'statusBar', 'statusItem'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    },
    header: {
      background: '#2d2d30',
      padding: '10px 20px',
      borderBottom: '1px solid #3e3e42',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    headerTitle: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#cccccc'
    },
    actions: {
      display: 'flex',
      gap: '10px'
    },
    body: {
      flex: '1',
      display: 'flex',
      overflow: 'hidden'
    },
    statusBar: {
      background: '#007acc',
      color: 'white',
      padding: '4px 20px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    statusItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '0 8px',
      transition: 'background 0.2s',
      '&[style*="cursor: pointer"]:hover': {
        background: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  variants: {
    statusItemType: {
      dynamic: {
        statusItem: {
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }
    }
  }
})
