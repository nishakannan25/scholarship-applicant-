import React from 'react';
import { useApplicationStore } from '../stores/useApplicationStore';
import { DollarSign, Users, Briefcase, Tag } from 'lucide-react';

export const FinancialDetailsTab: React.FC = () => {
  const { currentApplication, updateFinancial } = useApplicationStore();
  const financial = currentApplication?.financial;

  if (!financial) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-500" /> Step 3: Financial & Family Details
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Provide family income and household information for need-based verification.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Family Income */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Annual Family Income</label>
          <select
            value={financial.familyIncome}
            onChange={(e) => {
              updateFinancial({ familyIncome: e.target.value });
              useApplicationStore.getState().triggerAutosave();
            }}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Below $30,000">Below $30,000</option>
            <option value="$30,000 - $60,000">$30,000 - $60,000</option>
            <option value="$60,000 - $80,000">$60,000 - $80,000</option>
            <option value="$80,000 - $120,000">$80,000 - $120,000</option>
            <option value="Above $120,000">Above $120,000</option>
          </select>
        </div>

        {/* Primary Income Source */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Primary Income Source</label>
          <div className="relative">
            <Briefcase className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={financial.incomeSource}
              onChange={(e) => updateFinancial({ incomeSource: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. Salaried Employment / Business"
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Family Member Count */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Family Member Count</label>
          <div className="relative">
            <Users className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="number"
              min="1"
              value={financial.familyMemberCount}
              onChange={(e) => updateFinancial({ familyMemberCount: e.target.value })}
              onBlur={() => useApplicationStore.getState().triggerAutosave()}
              placeholder="e.g. 4"
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Financial Category */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Financial Category</label>
          <div className="relative">
            <Tag className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <select
              value={financial.financialCategory}
              onChange={(e) => {
                updateFinancial({ financialCategory: e.target.value });
                useApplicationStore.getState().triggerAutosave();
              }}
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="General / Moderate Income">General / Moderate Income</option>
              <option value="Low Income Threshold">Low Income Threshold</option>
              <option value="Single Income Household">Single Income Household</option>
              <option value="Economically Weaker Section">Economically Weaker Section</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
