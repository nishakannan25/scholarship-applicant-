import React, { useState, useEffect } from 'react';
import { InstitutionAutocomplete } from './InstitutionAutocomplete';
import { RoleSelector, ApplicantRole } from './RoleSelector';
import { useGeolocation } from '../hooks/useGeolocation';
import { User, Mail, Phone, MapPin, Sparkles, ArrowRight, Award, FileText, CreditCard, Calendar } from 'lucide-react';
import { useUiStore } from '../../../stores/useUiStore';

export type BoardType = 'state' | 'central';

export interface RegistrationStep1Data {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  role: ApplicantRole | '';
  city: string;
  state: string;
  country: string;

  // Board & Academic Details
  boardType?: BoardType;
  aadhaarNumber?: string;
  age?: string;
  marks10th?: string;
  percentage10th?: string;
  marks12th?: string;
  percentage12th?: string;

  // College Student Specific Details
  degreeCourse?: string;
  studyYear?: string;
  cgpaPercentage?: string;
  majorBranch?: string;
}

interface RegistrationStep1Props {
  onNext: (data: RegistrationStep1Data) => void;
}

export const RegistrationStep1: React.FC<RegistrationStep1Props> = ({ onNext }) => {
  const { t } = useUiStore();
  const [formData, setFormData] = useState<RegistrationStep1Data>({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    role: '',
    city: '',
    state: '',
    country: '',
    boardType: 'state',
    aadhaarNumber: '',
    age: '',
    marks10th: '',
    percentage10th: '',
    marks12th: '',
    percentage12th: '',
    degreeCourse: '',
    studyYear: '1st Year',
    cgpaPercentage: '',
    majorBranch: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationStep1Data, string>>>({});
  const { location, detected, loading: geoLoading, detectLocation } = useGeolocation();
  const [locationAutoFilled, setLocationAutoFilled] = useState(false);

  // Auto-populate location fields when detected by browser geolocation
  useEffect(() => {
    if (location && !locationAutoFilled) {
      setFormData((prev) => ({
        ...prev,
        city: prev.city || location.city,
        state: prev.state || location.state,
        country: prev.country || location.country,
      }));
      setLocationAutoFilled(true);
    }
  }, [location, locationAutoFilled]);

  const handleChange = (field: keyof RegistrationStep1Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationStep1Data, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
    if (!formData.role) newErrors.role = 'Please select an applicant role';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator Header */}
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <span>{t.stepIndicator}</span>
          <span>{t.personalAcademicDetails}</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t.createAccountHeader}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t.createAccountSubheader}
        </p>
      </div>

      {/* Geolocation Auto-Detection Notice */}
      {detected && locationAutoFilled && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-amberNotice-50 dark:bg-amberNotice-500/10 border border-amberNotice-500/30 text-amberNotice-700 dark:text-amberNotice-500 text-xs font-medium">
          <Sparkles className="h-4 w-4 shrink-0 text-amberNotice-500" />
          <span>{t.locationDetected}</span>
        </div>
      )}

      {geoLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          {t.detectingLocation}
        </div>
      )}

      {/* Role Selection */}
      <RoleSelector
        value={formData.role}
        onChange={(role) => handleChange('role', role)}
        error={errors.role}
      />

      {/* Full Name & Email Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t.fullName} <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Nisha"
              className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.fullName ? 'border-destructive' : 'border-input'
              }`}
            />
          </div>
          {errors.fullName && <p className="text-xs text-destructive mt-1 font-medium">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t.emailAddress} <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="nisha@example.com"
              className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.email ? 'border-destructive' : 'border-input'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive mt-1 font-medium">{errors.email}</p>}
        </div>
      </div>

      {/* Phone Number & Institution Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t.phoneNumber} <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Phone className="h-4 w-4" />
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.phone ? 'border-destructive' : 'border-input'
              }`}
            />
          </div>
          {errors.phone && <p className="text-xs text-destructive mt-1 font-medium">{errors.phone}</p>}
        </div>

        <div>
          <InstitutionAutocomplete
            value={formData.institution}
            onChange={(val) => handleChange('institution', val)}
            error={errors.institution}
          />
        </div>
      </div>

      {/* Dynamic Board Selection & Academic Details */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Award className="h-4 w-4" /> {t.academicBoardHeader}
          </span>
          <span className="text-[11px] text-muted-foreground">{t.academicBoardSubtitle}</span>
        </div>

        {/* School Student Options */}
        {formData.role === 'school' && (
          <div className="space-y-4">
            {/* Board Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                {t.educationBoard} <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('boardType', 'state')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    formData.boardType === 'state'
                      ? 'bg-primary/10 border-primary text-primary shadow-sm'
                      : 'bg-background border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  {t.stateBoard}
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('boardType', 'central')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    formData.boardType === 'central'
                      ? 'bg-primary/10 border-primary text-primary shadow-sm'
                      : 'bg-background border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <Award className="h-4 w-4" />
                  {t.centralBoard}
                </button>
              </div>
            </div>

            {/* Additional Fields: Marks, Age, Aadhaar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.ageDob}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="e.g. 17 Yrs"
                    className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.aadhaarNumber}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    maxLength={14}
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.percentage10th}
                </label>
                <input
                  type="text"
                  value={formData.percentage10th}
                  onChange={(e) => handleChange('percentage10th', e.target.value)}
                  placeholder="e.g. 88.5%"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.marks10th}
                </label>
                <input
                  type="text"
                  value={formData.marks10th}
                  onChange={(e) => handleChange('marks10th', e.target.value)}
                  placeholder="e.g. 442 / 500"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.percentage12th}
                </label>
                <input
                  type="text"
                  value={formData.percentage12th}
                  onChange={(e) => handleChange('percentage12th', e.target.value)}
                  placeholder="e.g. 91.2%"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.marks12th}
                </label>
                <input
                  type="text"
                  value={formData.marks12th}
                  onChange={(e) => handleChange('marks12th', e.target.value)}
                  placeholder="e.g. 547 / 600"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* College Student Options */}
        {formData.role === 'college' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.courseDegree}
                </label>
                <input
                  type="text"
                  value={formData.degreeCourse}
                  onChange={(e) => handleChange('degreeCourse', e.target.value)}
                  placeholder="e.g. B.Tech / B.E / B.Sc / MBBS"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.yearOfStudy}
                </label>
                <select
                  value={formData.studyYear}
                  onChange={(e) => handleChange('studyYear', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Post Graduate">Post Graduate / Masters</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.majorBranch}
                </label>
                <input
                  type="text"
                  value={formData.majorBranch}
                  onChange={(e) => handleChange('majorBranch', e.target.value)}
                  placeholder="e.g. Computer Science / AI / Mechanical"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.cgpaPercentage}
                </label>
                <input
                  type="text"
                  value={formData.cgpaPercentage}
                  onChange={(e) => handleChange('cgpaPercentage', e.target.value)}
                  placeholder="e.g. 8.75 CGPA or 85%"
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {t.aadhaarNumber}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    maxLength={14}
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General / Other Role Notice */}
        {formData.role !== 'school' && formData.role !== 'college' && (
          <p className="text-xs text-muted-foreground italic">
            {t.selectRoleUnlockNotice}
          </p>
        )}
      </div>

      {/* Location Fields Grid */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> {t.locationInformation}
          </label>

          <button
            type="button"
            onClick={detectLocation}
            disabled={geoLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {geoLoading ? (
              <>
                <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                {t.detectingLocation}
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {t.detectLocation}
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t.city} <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="City"
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.city ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.city && <p className="text-xs text-destructive mt-1 font-medium">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t.state} <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="State"
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.state ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.state && <p className="text-xs text-destructive mt-1 font-medium">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {t.country} <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="Country"
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.country ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.country && <p className="text-xs text-destructive mt-1 font-medium">{errors.country}</p>}
          </div>
        </div>
      </div>

      {/* Form Submission Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm"
        >
          {t.continueToStep2}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
