/**
 * Tests for useUIStore (Zustand)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import useUIStore from '../../stores/useUIStore';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useUIStore.setState({
      isSidebarCollapsed: false,
      activeModal: null,
      modalData: null,
      isCommandPaletteOpen: false,
      isNotificationsOpen: false,
      globalLoading: false,
      toasts: [],
    });
  });

  describe('Sidebar', () => {
    it('should toggle sidebar collapsed state', () => {
      const { toggleSidebar, isSidebarCollapsed } = useUIStore.getState();
      
      expect(isSidebarCollapsed).toBe(false);
      
      act(() => {
        toggleSidebar();
      });
      
      expect(useUIStore.getState().isSidebarCollapsed).toBe(true);
    });

    it('should set sidebar collapsed directly', () => {
      act(() => {
        useUIStore.getState().setSidebarCollapsed(true);
      });
      
      expect(useUIStore.getState().isSidebarCollapsed).toBe(true);
    });
  });

  describe('Modal', () => {
    it('should open modal with id and data', () => {
      act(() => {
        useUIStore.getState().openModal('confirm-delete', { id: 123 });
      });
      
      const state = useUIStore.getState();
      expect(state.activeModal).toBe('confirm-delete');
      expect(state.modalData).toEqual({ id: 123 });
    });

    it('should close modal and clear data', () => {
      act(() => {
        useUIStore.getState().openModal('test', { foo: 'bar' });
        useUIStore.getState().closeModal();
      });
      
      const state = useUIStore.getState();
      expect(state.activeModal).toBe(null);
      expect(state.modalData).toBe(null);
    });
  });

  describe('Toasts', () => {
    it('should add a toast', () => {
      act(() => {
        useUIStore.getState().addToast({ type: 'success', message: 'Saved!' });
      });
      
      const toasts = useUIStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].message).toBe('Saved!');
      expect(toasts[0].id).toBeDefined();
    });

    it('should remove a toast by id', () => {
      act(() => {
        useUIStore.getState().addToast({ type: 'info', message: 'Test' });
      });
      
      const toastId = useUIStore.getState().toasts[0].id;
      
      act(() => {
        useUIStore.getState().removeToast(toastId);
      });
      
      expect(useUIStore.getState().toasts).toHaveLength(0);
    });

    it('should clear all toasts', () => {
      act(() => {
        useUIStore.getState().addToast({ message: 'One' });
        useUIStore.getState().addToast({ message: 'Two' });
        useUIStore.getState().clearToasts();
      });
      
      expect(useUIStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('Loading State', () => {
    it('should set global loading', () => {
      act(() => {
        useUIStore.getState().setGlobalLoading(true);
      });
      
      expect(useUIStore.getState().globalLoading).toBe(true);
    });
  });
});
