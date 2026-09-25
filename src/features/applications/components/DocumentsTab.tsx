import React, { useRef } from 'react';
import { useApplicationStore } from '../stores/useApplicationStore';
import { FieldLockWrapper } from '../../veriflow/components/FieldLockWrapper';
import { FileText, Upload, Trash2, CheckCircle2 } from 'lucide-react';

export const DocumentsTab: React.FC = () => {
  const { currentApplication, addDocument, removeDocument } = useApplicationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docs = currentApplication?.documents || [];

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      // Capture document metadata ONLY (never store or expose filesystem paths)
      addDocument({
        id: `doc-${Math.random().toString(36).substring(2, 7)}`,
        filename: f.name,
        type: f.type || 'application/pdf',
        size: f.size,
        uploadedAt: new Date().toLocaleString(),
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Step 4: Required Documents Upload
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upload official transcripts, income certificates, and ID proof. Metadata is safely registered.
        </p>
      </div>

      {/* Drag & Drop simulated upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl bg-primary/5 text-center cursor-pointer transition-colors space-y-2 group"
      >
        <div className="bg-card border border-border p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Upload className="h-6 w-6" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-foreground">Click or drop files to upload metadata</p>
          <p className="text-xs text-muted-foreground">Supports PDF, PNG, JPG (Max 5MB per document)</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelected}
          className="hidden"
        />
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Uploaded Documents ({docs.length})
        </h3>

        {/* VeriFlow Target Field Lock Wrapper */}
        <FieldLockWrapper fieldKey="bank_statement">
          <div className="p-3.5 rounded-xl border border-amberNotice-500/30 bg-amberNotice-500/5 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-amberNotice-600 dark:text-amberNotice-400 uppercase">
              VeriFlow Rule Requirement: Bank Statement (Certified)
            </span>
            <p className="text-muted-foreground">
              Admin published rule Fact v4.0.2 requiring official certified bank statement.
            </p>
          </div>
        </FieldLockWrapper>

        {docs.length > 0 ? (
          <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden text-xs">
            {docs.map((doc) => (
              <div key={doc.id} className="p-3.5 flex items-center justify-between hover:bg-accent/20 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      {doc.filename}
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatSize(doc.size)} • Uploaded {doc.uploadedAt}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeDocument(doc.id)}
                  className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
};
