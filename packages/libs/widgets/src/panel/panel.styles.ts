import { defineSlotRecipe } from '@pandacss/dev'

export const panel = defineSlotRecipe({
  className: 'panel',
  slots: ['root', 'container', 'header', 'title', 'actions', 'content', 'emptyState', 'emptyStateTitle', 'emptyStateText', 'tabs', 'tab', 'tabTitle', 'tabClose'],
  base: {
    container: {
      flex: '1',
      display: 'flex',
      flexDirection: 'row',
      gap: '1px',
      background: '#3e3e42',
      padding: '1px',
      overflowX: 'auto',
      '@media (max-width: 768px)': {
        flexDirection: 'column'
      }
    },
    root: {
      flex: '1 1 auto',
      background: '#252526',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '300px',
      position: 'relative',
      overflow: 'hidden',
      '@media (max-width: 768px)': {
        minWidth: 'auto',
        minHeight: '200px'
      }
    },
    header: {
      background: '#2d2d30',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderBottom: '1px solid #3e3e42'
    },
    title: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#cccccc'
    },
    actions: {
      display: 'flex',
      gap: '5px'
    },
    content: {
      flex: '1',
      padding: '20px',
      overflowY: 'auto',
      color: '#cccccc'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      color: '#6e6e6e',
      textAlign: 'center'
    },
    emptyStateTitle: {
      fontSize: '18px',
      fontWeight: '400',
      marginBottom: '10px'
    },
    emptyStateText: {
      fontSize: '14px'
    },
    tabs: {
      display: 'flex',
      background: '#2d2d30',
      overflowX: 'auto',
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': {
        height: '3px'
      },
      '&::-webkit-scrollbar-track': {
        background: '#1e1e1e'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#464647'
      }
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '8px 12px',
      background: '#2d2d30',
      borderRight: '1px solid #252526',
      cursor: 'pointer',
      minWidth: '120px',
      maxWidth: '200px',
      position: 'relative',
      '&:hover': {
        background: '#323234',
        '& .panel__tabClose': {
          opacity: '0.7'
        }
      }
    },
    tabTitle: {
      flex: '1',
      fontSize: '13px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    tabClose: {
      background: 'none',
      border: 'none',
      color: '#cccccc',
      cursor: 'pointer',
      padding: '2px',
      borderRadius: '3px',
      fontSize: '14px',
      lineHeight: '1',
      opacity: '0',
      transition: 'opacity 0.2s',
      '&:hover': {
        opacity: '1',
        background: '#5a5a5a'
      }
    }
  },
  variants: {
    tabState: {
      active: {
        tab: {
          background: '#1e1e1e',
          color: 'white'
        }
      }
    }
  }
})
