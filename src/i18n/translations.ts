export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  // Navigation & Branding
  brandName: string;
  portalTitle: string;
  login: string;
  register: string;
  createAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  logout: string;
  dashboard: string;
  scholarships: string;
  applications: string;
  profile: string;
  security: string;

  // Welcome / Hero Page
  welcomeBadge: string;
  welcomeHeading: string;
  welcomeSubheading: string;
  welcomeDescription: string;
  startJourneyButton: string;
  exploreScholarshipsButton: string;
  verifiedFundingTitle: string;
  verifiedFundingDesc: string;
  veriflowTitle: string;
  veriflowDesc: string;
  directTrackingTitle: string;
  directTrackingDesc: string;
  copyright: string;

  // Registration Form Welcome Step 0
  formWelcomeBadge: string;
  whatYouWillNeedHeader: string;
  needAcademicLevel: string;
  needPersonalDetails: string;
  needAuthenticatorApp: string;

  // Registration Page & Steps
  stepIndicator: string;
  createAccountHeader: string;
  createAccountSubheader: string;
  personalAcademicDetails: string;
  locationDetected: string;
  detectingLocation: string;
  selectRole: string;
  schoolStudentTitle: string;
  schoolStudentDesc: string;
  collegeStudentTitle: string;
  collegeStudentDesc: string;
  otherRoleTitle: string;
  otherRoleDesc: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  institutionName: string;
  searchInstitution: string;
  locationInformation: string;
  city: string;
  state: string;
  country: string;
  detectLocation: string;
  continueToStep2: string;

  // Board & Academic Details
  academicBoardHeader: string;
  academicBoardSubtitle: string;
  selectRoleUnlockNotice: string;
  educationBoard: string;
  stateBoard: string;
  centralBoard: string;
  ageDob: string;
  aadhaarNumber: string;
  percentage10th: string;
  marks10th: string;
  percentage12th: string;
  marks12th: string;
  courseDegree: string;
  yearOfStudy: string;
  majorBranch: string;
  cgpaPercentage: string;

  // Auth / OTP / 2FA
  otpVerificationTitle: string;
  otpDescription: string;
  enterOtp: string;
  verifyOtp: string;
  resendOtp: string;
  authenticatorSetupTitle: string;
  authenticatorSetupDesc: string;
  scanQr: string;
  enterTotpCode: string;
  verify2FA: string;
  createPasswordTitle: string;
  createPasswordDesc: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  completeRegistration: string;
  accountCreatedSuccess: string;
  saveAppNumberNotice: string;
  yourAppNumber: string;
  copyAppNumber: string;
  copied: string;
  continueToLogin: string;

  // Login Page
  loginPortalTitle: string;
  loginDescription: string;
  appNumberLabel: string;
  password: string;
  loginButton: string;

  // Languages
  english: string;
  tamil: string;
  hindi: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'ScholarPath',
    portalTitle: 'Applicant Portal',
    login: 'Log In',
    register: 'Register',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    logout: 'Log Out',
    dashboard: 'Dashboard',
    scholarships: 'Scholarships',
    applications: 'My Applications',
    profile: 'Profile',
    security: '2FA & Security',

    welcomeBadge: 'Welcome to ScholarPath Portal',
    welcomeHeading: 'Welcome to ScholarPath',
    welcomeSubheading: 'Your Unified Gateway for School & College Scholarships',
    welcomeDescription: 'Empowering State Board, Central Board (CBSE/ICSE), and College/University students across Tamil Nadu and India with direct, verified scholarship funding.',
    startJourneyButton: 'START SCHOLARPATH JOURNEY',
    exploreScholarshipsButton: 'Explore Scholarships',
    verifiedFundingTitle: 'Verified Funding',
    verifiedFundingDesc: 'Access transparent, official scholarship opportunities directly from accredited institutions.',
    veriflowTitle: 'VeriFlow Rules',
    veriflowDesc: 'Real-time eligibility checking ensures quick, automated compliance and fair assessment.',
    directTrackingTitle: 'Direct Tracking',
    directTrackingDesc: 'Stay updated on your application status, verification milestones, and decision timelines.',
    copyright: '© 2026 ScholarPath Applicant Portal. All rights reserved.',

    formWelcomeBadge: 'WELCOME TO SCHOLARPATH REGISTRATION',
    whatYouWillNeedHeader: 'WHAT YOU WILL NEED TO REGISTER:',
    needAcademicLevel: 'Academic level: State Board (TN), Central Board (CBSE/ICSE), or College Degree.',
    needPersonalDetails: 'Personal details: Email address, phone number, and location.',
    needAuthenticatorApp: 'Google Authenticator app installed for secure 2FA authentication.',

    stepIndicator: 'STEP 1 OF 2',
    createAccountHeader: 'Create Your Account',
    createAccountSubheader: 'Provide your basic information and academic profile to discover targeted scholarships.',
    personalAcademicDetails: 'PERSONAL & ACADEMIC DETAILS',
    locationDetected: 'Location detected automatically. You can edit city, state, or country at any time.',
    detectingLocation: 'Detecting location...',
    selectRole: 'Applicant Role',
    schoolStudentTitle: 'School Student',
    schoolStudentDesc: 'Enrolled in high school or secondary education',
    collegeStudentTitle: 'College Student',
    collegeStudentDesc: 'Enrolled in undergraduate or graduate university',
    otherRoleTitle: 'Other',
    otherRoleDesc: 'Independent learner, researcher, or professional',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    institutionName: 'University / Institution',
    searchInstitution: 'Search or enter institution name...',
    locationInformation: 'Location Information',
    city: 'City',
    state: 'State / Province',
    country: 'Country',
    detectLocation: 'Detect Real-Time Location',
    continueToStep2: 'Continue to Step 2',

    academicBoardHeader: 'ACADEMIC BOARD & QUALIFICATIONS',
    academicBoardSubtitle: 'Customized for your education level',
    selectRoleUnlockNotice: 'Select an applicant role above to unlock board-specific or degree registration options.',
    educationBoard: 'Education Board',
    stateBoard: 'State Board (Tamil Nadu)',
    centralBoard: 'Central Board (CBSE / ICSE)',
    ageDob: 'Age / Date of Birth (Optional)',
    aadhaarNumber: 'Aadhaar Number (Optional)',
    percentage10th: '10th Percentage (%)',
    marks10th: '10th Total Marks (Optional)',
    percentage12th: '12th Percentage (%)',
    marks12th: '12th Total Marks (Optional)',
    courseDegree: 'Course / Degree Program',
    yearOfStudy: 'Year of Study',
    majorBranch: 'Major / Department Branch',
    cgpaPercentage: 'CGPA / Previous Percentage',

    otpVerificationTitle: 'Real-Time Email OTP Verification',
    otpDescription: 'We sent a 6-digit verification OTP to your email address.',
    enterOtp: 'Enter 6-Digit OTP',
    verifyOtp: 'Verify OTP & Continue',
    resendOtp: 'Resend OTP',
    authenticatorSetupTitle: 'Google Authenticator 2FA Setup',
    authenticatorSetupDesc: 'Scan this QR code with Google Authenticator or Microsoft Authenticator app.',
    scanQr: 'Scan QR Code',
    enterTotpCode: 'Enter 6-Digit Authenticator Code',
    verify2FA: 'Verify 2FA & Continue',
    createPasswordTitle: 'Set Your Account Password',
    createPasswordDesc: 'Choose a strong password to protect your ScholarPath applicant portal.',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    completeRegistration: 'Complete Account Registration',
    accountCreatedSuccess: 'Account Created Successfully!',
    saveAppNumberNotice: 'Your ScholarPath applicant profile is active. Please save your Application Number.',
    yourAppNumber: 'Your ScholarPath Application Number',
    copyAppNumber: 'Copy Application Number',
    copied: 'Copied to Clipboard!',
    continueToLogin: 'Continue to Login',

    loginPortalTitle: 'Applicant Portal Login',
    loginDescription: 'Enter your permanent Application Number and password to access your portal.',
    appNumberLabel: 'Application Number',
    password: 'Password',
    loginButton: 'Log In to Applicant Portal',

    english: 'English',
    tamil: 'தமிழ் (Tamil)',
    hindi: 'हिंदी (Hindi)',
  },
  ta: {
    brandName: 'ஸ்காலர்பாத் (ScholarPath)',
    portalTitle: 'மாணவர் போர்டல்',
    login: 'உள்நுழைக',
    register: 'பதிவு செய்க',
    createAccount: 'கணக்கை உருவாக்குங்கள்',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    dontHaveAccount: 'கணக்கு இல்லையா?',
    logout: 'வெளியேறு',
    dashboard: 'முகப்பு பலகை',
    scholarships: 'கல்வி உதவித்தொகைகள்',
    applications: 'என் விண்ணப்பங்கள்',
    profile: 'சுயவிவரம்',
    security: '2FA & பாதுகாப்பு',

    welcomeBadge: 'ஸ்காலர்பாத் போர்ட்டலுக்கு நல்வரவு',
    welcomeHeading: 'ஸ்காலர்பாத் (ScholarPath) -க்கு நல்வரவு',
    welcomeSubheading: 'பள்ளி மற்றும் கல்லூரி கல்வி உதவித்தொகைகளுக்கான ஒரே தளம்',
    welcomeDescription: 'தமிழ்நாடு மற்றும் இந்தியாவின் மாநில பாடத்திட்டம் (State Board), மத்திய பாடத்திட்டம் (CBSE/ICSE) மற்றும் கல்லூரி மாணவர்களுக்கான நேரடி கல்வி உதவித்தொகை தளம்.',
    startJourneyButton: 'ஸ்காலர்பாத் பயணத்தைத் தொடங்குங்கள்',
    exploreScholarshipsButton: 'உதவித்தொகைகளை ஆராயுங்கள்',
    verifiedFundingTitle: 'சரிபார்க்கப்பட்ட உதவித்தொகை',
    verifiedFundingDesc: 'அங்கீகரிக்கப்பட்ட நிறுவனங்களிலிருந்து அதிகாரப்பூர்வ உதவித்தொகை வாய்ப்புகளைப் பெறுங்கள்.',
    veriflowTitle: 'VeriFlow விதிகள்',
    veriflowDesc: 'நிகழ்நேர தகுதி சரிபார்ப்பு விரைவான மற்றும் நியாயமான மதிப்பீட்டை உறுதி செய்கிறது.',
    directTrackingTitle: 'நேரடி கண்காணிப்பு',
    directTrackingDesc: 'உங்கள் விண்ணப்பத்தின் நிலை மற்றும் சரிபார்ப்பு படிநிலைகளை உடனுக்குடன் தெரிந்து கொள்ளுங்கள்.',
    copyright: '© 2026 ஸ்காலர்பாத் விண்ணப்பதாரர் போர்டல். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',

    formWelcomeBadge: 'ஸ்காலர்பாத் பதிவுக்கு நல்வரவு',
    whatYouWillNeedHeader: 'பதிவு செய்ய உங்களுக்குத் தேவையானவை:',
    needAcademicLevel: 'கல்வி நிலை: மாநில பாடத்திட்டம் (TN), மத்திய பாடத்திட்டம் (CBSE/ICSE), அல்லது கல்லூரி பட்டப்படிப்பு.',
    needPersonalDetails: 'தனிப்பட்ட விவரங்கள்: மின்னஞ்சல் முகவரி, தொலைபேசி எண் மற்றும் இருப்பிடம்.',
    needAuthenticatorApp: 'பாதுகாப்பான 2FA சரிபார்ப்பிற்கு Google Authenticator செயலி நிறுவப்பட்டிருக்க வேண்டும்.',

    stepIndicator: 'படி 1 / 2',
    createAccountHeader: 'உங்கள் கணக்கை உருவாக்குங்கள்',
    createAccountSubheader: 'உங்களுக்கு ஏற்ற கல்வி உதவித்தொகைகளைக் கண்டறிய உங்கள் அடிப்படை விவரங்களையும் கல்வி சுயவிவரத்தையும் வழங்கவும்.',
    personalAcademicDetails: 'தனிப்பட்ட & கல்வி விவரங்கள்',
    locationDetected: 'உங்கள் இருப்பிடம் தானாகக் கண்டறியப்பட்டது. தேவைப்பட்டால் நகரம் மற்றும் மாநிலத்தை மாற்றலாம்.',
    detectingLocation: 'இருப்பிடம் கண்டறியப்படுகிறது...',
    selectRole: 'விண்ணப்பதாரர் வகை',
    schoolStudentTitle: 'பள்ளி மாணவர்',
    schoolStudentDesc: 'மேல்நிலை அல்லது உயர்நிலைப் பள்ளியில் பயில்பவர்',
    collegeStudentTitle: 'கல்லூரி மாணவர்',
    collegeStudentDesc: 'இளங்கலை அல்லது முதுகலை பல்கலைக்கழகத்தில் பயில்பவர்',
    otherRoleTitle: 'இதரப் பிரிவு',
    otherRoleDesc: 'சுயாதீன கற்றவர், ஆராய்ச்சியாளர் அல்லது தொழிலாளி',
    fullName: 'முழு பெயர்',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    phoneNumber: 'தொலைபேசி எண்',
    institutionName: 'பல்கலைக்கழகம் / கல்வி நிறுவனம்',
    searchInstitution: 'கல்வி நிறுவனத்தின் பெயரை உள்ளிடவும்...',
    locationInformation: 'இருப்பிட விவரங்கள்',
    city: 'நகரம்',
    state: 'மாநிலம்',
    country: 'நாடு',
    detectLocation: 'இருப்பிடத்தைக் கண்டறி',
    continueToStep2: 'படி 2-க்குச் செல்லவும்',

    academicBoardHeader: 'கல்வி வாரியம் & தகுதிகள்',
    academicBoardSubtitle: 'உங்கள் கல்வி நிலைக்கு ஏற்ப பிரத்யேகமானது',
    selectRoleUnlockNotice: 'வாரியம் அல்லது பட்டப்படிப்பு விருப்பங்களைத் திறக்க மேலே உள்ள விண்ணப்பதாரர் வகையைத் தேர்ந்தெடுக்கவும்.',
    educationBoard: 'கல்வி வாரியம்',
    stateBoard: 'மாநில பாடத்திட்டம் (State Board - தமிழ்நாடு)',
    centralBoard: 'மத்திய பாடத்திட்டம் (Central Board - CBSE / ICSE)',
    ageDob: 'வயது / பிறந்த தேதி (விருப்பத்தேர்வு)',
    aadhaarNumber: 'ஆதார் எண் (விருப்பத்தேர்வு)',
    percentage10th: '10-ஆம் வகுப்பு சதவீதம் (%)',
    marks10th: '10-ஆம் வகுப்பு மொத்த மதிப்பெண்கள்',
    percentage12th: '12-ஆம் வகுப்பு சதவீதம் (%)',
    marks12th: '12-ஆம் வகுப்பு மொத்த மதிப்பெண்கள்',
    courseDegree: 'பட்டப்படிப்பு / கோர்ஸ்',
    yearOfStudy: 'படிக்கும் ஆண்டு',
    majorBranch: 'துறை / பிரிவு (Major)',
    cgpaPercentage: 'CGPA / மதிப்பெண் சதவீதம்',

    otpVerificationTitle: 'மின்னஞ்சல் OTP சரிபார்ப்பு',
    otpDescription: 'உங்கள் மின்னஞ்சல் முகவரிக்கு 6 இலக்க OTP அனுப்பப்பட்டுள்ளது.',
    enterOtp: '6 இலக்க OTP-ஐ உள்ளிடவும்',
    verifyOtp: 'OTP சரிபார்த்துத் தொடரவும்',
    resendOtp: 'OTP மீண்டும் அனுப்புக',
    authenticatorSetupTitle: 'கூகிள் அத்தென்டிகேட்டர் 2FA அமைப்பு',
    authenticatorSetupDesc: 'Google Authenticator செயலி மூலம் இந்த QR குறியீட்டை ஸ்கேன் செய்யவும்.',
    scanQr: 'QR குறியீட்டை ஸ்கேன் செய்க',
    enterTotpCode: '6 இலக்க பாதுகாப்பு குறியீட்டை உள்ளிடவும்',
    verify2FA: '2FA சரிபார்த்துத் தொடரவும்',
    createPasswordTitle: 'கடவுச்சொல்லை உருவாக்கவும்',
    createPasswordDesc: 'உங்கள் கணக்கைப் பாதுகாக்க வலுவான கடவுச்சொல்லைத் தேர்ந்தெடுக்கவும்.',
    passwordLabel: 'கடவுச்சொல்',
    confirmPasswordLabel: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    completeRegistration: 'பதிவை நிறைவு செய்க',
    accountCreatedSuccess: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!',
    saveAppNumberNotice: 'உங்கள் ஸ்காலர்பாத் விண்ணப்ப எண் உருவாக்கப்பட்டது. உள்நுழைய இதைப் பாதுகாப்பாக வைக்கவும்.',
    yourAppNumber: 'உங்கள் ஸ்காலர்பாத் விண்ணப்ப எண்',
    copyAppNumber: 'விண்ணப்ப எண்ணை நகலெடு',
    copied: 'நகலெடுக்கப்பட்டது!',
    continueToLogin: 'உள்நுழைவுக்குச் செல்லவும்',

    loginPortalTitle: 'மாணவர் உள்நுழைவு',
    loginDescription: 'உங்கள் நிரந்தர விண்ணப்ப எண் மற்றும் கடவுச்சொல்லை உள்ளிட்டு உள்நுழையவும்.',
    appNumberLabel: 'விண்ணப்ப எண் (Application Number)',
    password: 'கடவுச்சொல்',
    loginButton: 'போர்ட்டலில் உள்நுழைக',

    english: 'English',
    tamil: 'தமிழ் (Tamil)',
    hindi: 'हिंदी (Hindi)',
  },
  hi: {
    brandName: 'स्कॉलरपाथ (ScholarPath)',
    portalTitle: 'आवेदक पोर्टल',
    login: 'लॉग इन करें',
    register: 'पंजीकरण करें',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'क्या आपके पास पहले से खाता है?',
    dontHaveAccount: 'खाता नहीं है?',
    logout: 'लॉग आउट',
    dashboard: 'डैशबोर्ड',
    scholarships: 'छात्रवृत्तियां',
    applications: 'मेरे आवेदन',
    profile: 'प्रोफाइल',
    security: '2FA और सुरक्षा',

    welcomeBadge: 'स्कॉलरपाथ पोर्टल में आपका स्वागत है',
    welcomeHeading: 'स्कॉलरपाथ (ScholarPath) में आपका स्वागत है',
    welcomeSubheading: 'स्कूल और कॉलेज छात्रवृत्ति के लिए एकीकृत पोर्टल',
    welcomeDescription: 'तमिलनाडु और भारत भर के स्टेट बोर्ड, सेंट्रल बोर्ड (CBSE/ICSE) और कॉलेज के छात्रों के लिए प्रत्यक्ष, सत्यापित छात्रवृत्ति वित्त पोषण।',
    startJourneyButton: 'स्कॉलरपाथ यात्रा शुरू करें',
    exploreScholarshipsButton: 'छात्रवृत्तियां खोजें',
    verifiedFundingTitle: 'सत्यापित फंडिंग',
    verifiedFundingDesc: 'मान्यता प्राप्त संस्थानों से सीधे पारदर्शी और आधिकारिक छात्रवृत्ति अवसर प्राप्त करें।',
    veriflowTitle: 'VeriFlow नियम',
    veriflowDesc: 'वास्तविक समय पात्रता जांच त्वरित, स्वचालित अनुपालन और निष्पक्ष मूल्यांकन सुनिश्चित करती है।',
    directTrackingTitle: 'प्रत्यक्ष ट्रैकिंग',
    directTrackingDesc: 'अपने आवेदन की स्थिति और सत्यापन मील के पत्थरों पर अपडेट रहें।',
    copyright: '© 2026 स्कॉलरपाथ आवेदक पोर्टल। सर्वाधिकार सुरक्षित।',

    formWelcomeBadge: 'स्कॉलरपाथ पंजीकरण में आपका स्वागत है',
    whatYouWillNeedHeader: 'पंजीकरण के लिए आपको क्या चाहिए:',
    needAcademicLevel: 'शैक्षणिक स्तर: स्टेट बोर्ड (TN), सेंट्रल बोर्ड (CBSE/ICSE), या कॉलेज डिग्री।',
    needPersonalDetails: 'व्यक्तिगत विवरण: ईमेल पता, फोन नंबर और स्थान।',
    needAuthenticatorApp: 'सुरक्षित 2FA प्रमाणीकरण के लिए Google Authenticator ऐप इंस्टॉल होना चाहिए।',

    stepIndicator: 'चरण 1 / 2',
    createAccountHeader: 'अपना खाता बनाएं',
    createAccountSubheader: 'उचित छात्रवृत्ति की खोज के लिए अपनी बुनियादी जानकारी और शैक्षणिक प्रोफाइल दर्ज करें।',
    personalAcademicDetails: 'व्यक्तिगत और शैक्षणिक विवरण',
    locationDetected: 'आपका स्थान स्वतः ही पहचान लिया गया है। आप कभी भी शहर और राज्य बदल सकते हैं।',
    detectingLocation: 'स्थान पहचाना जा रहा है...',
    selectRole: 'आवेदक भूमिका',
    schoolStudentTitle: 'स्कूल छात्र',
    schoolStudentDesc: 'हाई स्कूल या माध्यमिक शिक्षा में नामांकित',
    collegeStudentTitle: 'कॉलेज छात्र',
    collegeStudentDesc: 'स्नातक या स्नातकोत्तर विश्वविद्यालय में नामांकित',
    otherRoleTitle: 'अन्य',
    otherRoleDesc: 'स्वतंत्र शिक्षार्थी, शोधकर्ता या पेशेवर',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    phoneNumber: 'फोन नंबर',
    institutionName: 'विश्वविद्यालय / संस्थान',
    searchInstitution: 'संस्थान का नाम खोजें या दर्ज करें...',
    locationInformation: 'स्थान की जानकारी',
    city: 'शहर',
    state: 'राज्य',
    country: 'देश',
    detectLocation: 'स्थान पहचानें',
    continueToStep2: 'चरण 2 पर आगे बढ़ें',

    academicBoardHeader: 'शैक्षणिक बोर्ड और योग्यताएं',
    academicBoardSubtitle: 'आपके शिक्षा स्तर के लिए अनुकूलित',
    selectRoleUnlockNotice: 'बोर्ड-विशिष्ट या डिग्री पंजीकरण विकल्प अनलॉक करने के लिए ऊपर आवेदक भूमिका चुनें।',
    educationBoard: 'शिक्षा बोर्ड',
    stateBoard: 'स्टेट बोर्ड (तमिलनाडु)',
    centralBoard: 'सेंट्रल बोर्ड (CBSE / ICSE)',
    ageDob: 'आयु / जन्म तिथि (वैकल्पिक)',
    aadhaarNumber: 'आधार नंबर (वैकल्पिक)',
    percentage10th: '10वीं प्रतिशत (%)',
    marks10th: '10वीं कुल अंक (वैकल्पिक)',
    percentage12th: '12वीं प्रतिशत (%)',
    marks12th: '12वीं कुल अंक (वैकल्पिक)',
    courseDegree: 'पाठ्यक्रम / डिग्री प्रोग्राम',
    yearOfStudy: 'अध्ययन का वर्ष',
    majorBranch: 'मुख्य विषय / शाखा (Major)',
    cgpaPercentage: 'CGPA / पिछला प्रतिशत',

    otpVerificationTitle: 'ईमेल OTP सत्यापन',
    otpDescription: 'हमने आपके ईमेल पते पर 6-अंकों का OTP भेजा है।',
    enterOtp: '6-अंकों का OTP दर्ज करें',
    verifyOtp: 'OTP सत्यापित करें और आगे बढ़ें',
    resendOtp: 'पुनः OTP भेजें',
    authenticatorSetupTitle: 'गूगल प्रमाणक (2FA) सेटअप',
    authenticatorSetupDesc: 'Google Authenticator ऐप के साथ इस QR कोड को स्कैन करें।',
    scanQr: 'QR कोड स्कैन करें',
    enterTotpCode: '6-अंकों का ऑथेंटिकेटर कोड दर्ज करें',
    verify2FA: '2FA सत्यापित करें और आगे बढ़ें',
    createPasswordTitle: 'पासवर्ड सेट करें',
    createPasswordDesc: 'अपने स्कॉलरपाथ खाते की सुरक्षा के लिए एक मजबूत पासवर्ड चुनें।',
    passwordLabel: 'पासवर्ड',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    completeRegistration: 'पंजीकरण पूरा करें',
    accountCreatedSuccess: 'खाता सफलतापूर्वक बनाया गया!',
    saveAppNumberNotice: 'आपका स्कॉलरपाथ आवेदन नंबर तैयार है। लॉग इन करने के लिए इसे सुरक्षित रखें।',
    yourAppNumber: 'आपका स्कॉलरपाथ आवेदन नंबर',
    copyAppNumber: 'आवेदन नंबर कॉपी करें',
    copied: 'कॉपी किया गया!',
    continueToLogin: 'लॉगिन करें',

    loginPortalTitle: 'आवेदक लॉगिन',
    loginDescription: 'अपने स्थायी आवेदन नंबर और पासवर्ड के साथ पोर्टल पर लॉग इन करें।',
    appNumberLabel: 'आवेदन नंबर (Application Number)',
    password: 'पासवर्ड',
    loginButton: 'पोर्टल में लॉग इन करें',

    english: 'English',
    tamil: 'தமிழ் (Tamil)',
    hindi: 'हिंदी (Hindi)',
  },
};
