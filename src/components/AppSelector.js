import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '85vh',
    padding: '0',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000
  }
};

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 85vh;

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
    position: sticky;
    top: 0;
    z-index: 10;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    p {
      margin: 0.5rem 0 0;
      color: #6b7280;
      font-size: 0.875rem;
    }
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
      
      &:hover {
        background: #a1a1a1;
      }
    }
  }

  .modal-footer {
    padding: 1.25rem 1.5rem;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    position: sticky;
    bottom: 0;
    z-index: 10;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }
`;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
`;

const AppCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#f8fafc' : '#ffffff'};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  ${props => props.selected && `
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
    
    &::after {
      content: '';
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 1.25rem;
      height: 1.25rem;
      background-color: #3b82f6;
      border-radius: 50%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23ffffff'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E");
      background-size: 14px;
      background-position: center;
      background-repeat: no-repeat;
      transition: all 0.2s ease;
      opacity: 1;
      transform: scale(1);
    }
  `}

  .app-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .app-icon {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.selected ? '#f1f5f9' : '#f8fafc'};
    border-radius: 12px;
    color: #64748b;
    transition: all 0.2s ease;
    padding: 0.75rem;

    svg {
      width: 1.5rem;
      height: 1.5rem;
      stroke-width: 1.5;
    }

    ${props => props.selected && `
      background: #eff6ff;
      color: #3b82f6;
    `}
  }

  .app-info {
    flex: 1;
    min-width: 0;
  }

  h4 {
    margin: 0 0 0.25rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1f2937;
    padding-right: 2rem;
  }

  .app-description {
    margin: 0;
    font-size: 0.8125rem;
    color: #6b7280;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .badges {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
  }

  .badge {
    font-size: 0.6875rem;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    
    svg {
      width: 0.75rem;
      height: 0.75rem;
    }
    
    &.new {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    &.beta {
      background-color: #fae8ff;
      color: #86198f;
    }
    
    &.ai {
      background-color: #d1fae5;
      color: #065f46;
    }

    &.enterprise {
      background-color: #e0f2fe;
      color: #0369a1;
    }
  }

  .features {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${props => props.selected ? '#e2e8f0' : '#f1f5f9'};
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;
  }

  .feature {
    display: flex;
    align-items: center;
    gap: 0.375rem;

    svg {
      width: 0.875rem;
      height: 0.875rem;
      color: #22c55e;
    }
  }
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  ${props => props.primary ? `
    background-color: #3b82f6;
    color: white;
    border: none;

    &:hover {
      background-color: #2563eb;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #bfdbfe;
    }
  ` : `
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #e5e7eb;
    }
  `}
`;

export const AppSelector = ({ onClose, applications, selectedApps, onSave, categories }) => {
  const [selected, setSelected] = useState(new Set(selectedApps));

  const handleAppClick = (appId) => {
    const newSelected = new Set(selected);
    if (newSelected.has(appId)) {
      newSelected.delete(appId);
    } else {
      newSelected.add(appId);
    }
    setSelected(newSelected);
  };

  const handleSave = () => {
    onSave(Array.from(selected));
    onClose();
  };

  const getIcon = (app) => {
    // Reuse the same icon mapping from Dashboard.js
    switch (app.id) {
      case 'ai-toybox':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      // ... Add all the other icon cases from Dashboard.js ...
      default:
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel="Customize Dashboard"
    >
      <ModalContainer>
        <div className="modal-header">
          <h2>Customize Your Dashboard</h2>
          <p>Select the applications you want to see on your dashboard</p>
        </div>

        <div className="modal-body">
          {categories.map(category => {
            const categoryApps = applications.filter(app => app.category === category.id);
            if (categoryApps.length === 0) return null;

            return (
              <CategorySection key={category.id}>
                <h3>{category.name}</h3>
                <AppGrid>
                  {categoryApps.map(app => (
                    <AppCard
                      key={app.id}
                      selected={selected.has(app.id)}
                      onClick={() => handleAppClick(app.id)}
                    >
                      <div className="app-header">
                        <div className="app-icon">
                          {getIcon(app)}
                        </div>
                        <div className="app-info">
                          <h4>{app.name}</h4>
                          <p className="app-description">{app.description}</p>
                          <div className="badges">
                            {app.isNew && (
                              <span className="badge new">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                New
                              </span>
                            )}
                            {app.isBeta && (
                              <span className="badge beta">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Beta
                              </span>
                            )}
                            {app.isAI && (
                              <span className="badge ai">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
                                </svg>
                                AI Powered
                              </span>
                            )}
                            {app.brand === 'company' && (
                              <span className="badge enterprise">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Enterprise
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {app.features && (
                        <div className="features">
                          {app.features.map((feature, index) => (
                            <div key={index} className="feature">
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </AppCard>
                  ))}
                </AppGrid>
              </CategorySection>
            );
          })}
        </div>

        <div className="modal-footer">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={handleSave}>Save Changes</Button>
        </div>
      </ModalContainer>
    </Modal>
  );
}; 