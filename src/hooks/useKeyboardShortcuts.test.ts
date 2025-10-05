import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

type KeyboardModule = typeof import('./useKeyboardShortcuts');

const originalPlatform = navigator.platform;

const setPlatform = (value: string) => {
  Object.defineProperty(window.navigator, 'platform', {
    value,
    configurable: true,
  });
};

afterEach(() => {
  document.body.innerHTML = '';
  setPlatform(originalPlatform);
});

describe('useKeyboardShortcuts', () => {
  const renderWithModule = async <T extends keyof KeyboardModule>(key: T) => {
    vi.resetModules();
    return (await import('./useKeyboardShortcuts'))[key];
  };

  it('invokes the matching shortcut action on key press', async () => {
    setPlatform('Win32');
    const useKeyboardShortcuts = await renderWithModule('useKeyboardShortcuts');
    const action = vi.fn();

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts([
        { key: 'k', ctrlKey: true, action, description: 'Open palette' },
      ]),
    );

    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    await act(async () => {
      document.dispatchEvent(event);
    });

    expect(action).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('ignores shortcuts when typing in form fields', async () => {
    setPlatform('Win32');
    const useKeyboardShortcuts = await renderWithModule('useKeyboardShortcuts');
    const action = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts([
        { key: 'k', ctrlKey: true, action, description: 'Open palette' },
      ]),
    );

    const input = document.createElement('input');
    document.body.appendChild(input);

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });

    await act(async () => {
      input.dispatchEvent(event);
    });

    expect(action).not.toHaveBeenCalled();
  });

  it('formats shortcuts for display using modifier labels', async () => {
    setPlatform('Win32');
    const formatShortcut = await renderWithModule('formatShortcut');

    const formatted = formatShortcut({
      key: 'k',
      ctrlKey: true,
      shiftKey: true,
      action: () => {},
      description: 'Test shortcut',
    });

    expect(formatted).toBe('Ctrl + Shift + K');
  });

  it('detects modifier symbol for Mac and non-Mac platforms', async () => {
    setPlatform('Win32');
    let module = await import('./useKeyboardShortcuts');
    expect(module.isMac).toBe(false);
    expect(module.getModifierSymbol()).toBe('Ctrl');
    expect(module.getModifierKey()).toBe('ctrlKey');

    setPlatform('MacIntel');
    vi.resetModules();
    module = await import('./useKeyboardShortcuts');
    expect(module.isMac).toBe(true);
    expect(module.getModifierSymbol()).toBe('⌘');
    expect(module.getModifierKey()).toBe('metaKey');
  });
});
