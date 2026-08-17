const fs = require('fs');
let content = fs.readFileSync('src/store.ts', 'utf-8');

const updateCode = `
  public activateSubscription(specialistId: string, plan: import('./types').SubscriptionPlan) {
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
    
    this.saveState();
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
    
    this.saveState();
  }

`;

if (!content.includes('activateSubscription')) {
  content = content.replace(/  \/\/ Reset to initial seeds/g, updateCode + '  // Reset to initial seeds');
  fs.writeFileSync('src/store.ts', content);
  console.log('Added methods');
} else {
  console.log('Already added');
}
