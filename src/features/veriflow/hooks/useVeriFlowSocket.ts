import { useEffect, useRef } from 'react';
import { useApplicationStore } from '../../applications/stores/useApplicationStore';
import { VeriFlowEvent } from '../types';

export const useVeriFlowSocket = (applicationId: string) => {
  const handleVeriFlowEvent = useApplicationStore((s) => s.handleVeriFlowEvent);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!applicationId || connectedRef.current) return;
    connectedRef.current = true;

    // Simulate Secure Authenticated WebSocket connection: /ws/applications/{application_id}
    const wsUrl = `ws://localhost:8000/ws/applications/${applicationId}`;
    console.log(`[VeriFlow WS] Connecting to ${wsUrl}...`);

    // Listen to custom window events or demo trigger for real-time rule changes
    const handleDemoRuleEvent = (e: CustomEvent<VeriFlowEvent>) => {
      console.log('[VeriFlow WS] Received Event:', e.detail);
      handleVeriFlowEvent(e.detail);
    };

    window.addEventListener('veriflow:event' as any, handleDemoRuleEvent);

    return () => {
      console.log(`[VeriFlow WS] Disconnecting from ${wsUrl}`);
      connectedRef.current = false;
      window.removeEventListener('veriflow:event' as any, handleDemoRuleEvent);
    };
  }, [applicationId, handleVeriFlowEvent]);

  const publishDemoEvent = (event: Partial<VeriFlowEvent>) => {
    const fullEvent: VeriFlowEvent = {
      id: `evt-${Math.random().toString(36).substring(2, 7)}`,
      type: event.type || 'field_locked',
      fieldKey: event.fieldKey || 'bank_statement',
      fieldName: event.fieldName || 'Bank Statement (Certified)',
      tabIndex: event.tabIndex !== undefined ? event.tabIndex : 3,
      reason: event.reason || 'Admin published updated Fact v4.0.2 requiring certified bank statement for need verification.',
      aiExplanation:
        event.aiExplanation ||
        'The scholarship board updated compliance rules to verify family income. Submitting a certified bank statement ensures your application satisfies the new requirement without restarting.',
      timestamp: new Date().toLocaleTimeString(),
      factVersion: 'v4.0.2',
    };

    const customEvent = new CustomEvent('veriflow:event', { detail: fullEvent });
    window.dispatchEvent(customEvent);
  };

  return { publishDemoEvent };
};
