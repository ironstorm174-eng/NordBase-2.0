const fs = require('fs');
let content = fs.readFileSync('src/store.ts', 'utf-8');

// Modify store to add support for activating subscriptions.
const updateCode = `
  public activateSubscription(specialistId: string, plan: SubscriptionPlan) {
    let durationMonths = 0;
    if (plan === '1_month_free' || plan === '1_month') durationMonths = 1;
    if (plan === '3_months') durationMonths = 3;
    if (plan === '6_months') durationMonths = 6;
    if (plan === '12_months') durationMonths = 12;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    this.state = {
      ...this.state,
      specialists: this.state.specialists.map(s => 
        s.id === specialistId 
          ? { ...s, subscriptionPlan: plan, subscriptionStatus: 'active', subscriptionEndDate: endDate.toISOString() } 
          : s
      )
    };
    
    if (this.state.currentUser && this.state.currentUser.id === specialistId) {
      this.state.currentUser = { 
        ...this.state.currentUser, 
        subscriptionPlan: plan, 
        subscriptionStatus: 'active', 
        subscriptionEndDate: endDate.toISOString() 
      };
    }
    
    this.notify();
  }

  public updateMarketplaceProfile(specialistId: string, aboutMe: string, services: any[], availability: any[]) {
    this.state = {
      ...this.state,
      specialists: this.state.specialists.map(s => 
        s.id === specialistId 
          ? { ...s, aboutMe, marketplaceServices: services, marketplaceAvailability: availability } 
          : s
      )
    };
    
    if (this.state.currentUser && this.state.currentUser.id === specialistId) {
      this.state.currentUser = { 
        ...this.state.currentUser, 
        aboutMe, 
        marketplaceServices: services, 
        marketplaceAvailability: availability 
      };
    }
    
    this.notify();
  }
`;

if (!content.includes('activateSubscription(')) {
  content = content.replace(/public verifyDocument\(userId: string, documentName: string, approved: boolean\) \{/g, updateCode + '\n  public verifyDocument(userId: string, documentName: string, approved: boolean) {');
}

fs.writeFileSync('src/store.ts', content);
console.log('Done');
