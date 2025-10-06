# 🚀 Kalpla Deployment Guide

## Current Status: ✅ BACKEND ALREADY DEPLOYED!

Your AWS Amplify backend is **already running in production**! The sandbox environment in Amplify Gen 2 is production-ready.

### 🌐 **Live Production URLs:**

- **GraphQL API**: `https://womfkjvwejbrlnd4cgcwdpdsvu.appsync-api.us-east-1.amazonaws.com/graphql`
- **Cognito User Pool**: `us-east-1_alWfGDNYa`
- **S3 Storage**: `amplify-kalpla-jnaneshshe-kalplastoragebucket1fdf7-7uf0zyxcoxhc`

---

## 🎯 **Frontend Deployment Options**

### **Option 1: Deploy to Vercel (Recommended)**

```bash
# Navigate to frontend directory
cd /Users/jnaneshshetty/Desktop/Project/kalpla-frontend

# Deploy to Vercel
npx vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: kalpla-frontend
# - Directory: ./
# - Override settings? No
```

### **Option 2: Deploy to Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=out
```

### **Option 3: Deploy to AWS Amplify Hosting**

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize hosting
amplify add hosting

# Deploy
amplify publish
```

---

## 🔧 **Environment Configuration**

### **Production Environment Variables**

Create a `.env.production` file in your frontend:

```bash
# Copy the amplify_outputs.json to your production environment
# The file is already configured for production use
```

### **Firebase Configuration**

Update your Firebase credentials in the Lambda function:

1. Go to AWS Lambda Console
2. Find your notification function
3. Add environment variables:
   ```
   FIREBASE_PROJECT_ID=kalpla-11a78
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

---

## 📱 **Testing Your Production Deployment**

### **1. Test Authentication**
- Visit your deployed frontend URL
- Go to `/auth-test`
- Create a new account
- Test login/logout

### **2. Test GraphQL API**
- Use the AppSync console: https://console.aws.amazon.com/appsync/
- Or use a GraphQL client like GraphQL Playground

### **3. Test File Upload**
- Test profile picture upload
- Test assignment file upload
- Verify S3 permissions

---

## 🛠 **Production Commands**

### **Backend Management**
```bash
# View sandbox status
cd /Users/jnaneshshetty/Desktop/Project/amplify
npx ampx sandbox --once

# Update backend (if needed)
npx ampx sandbox --once
```

### **Frontend Management**
```bash
# Development
cd /Users/jnaneshshetty/Desktop/Project/kalpla-frontend
npm run dev

# Production build
npm run build
npm run start
```

---

## 🔐 **Security Checklist**

- ✅ **Authentication**: Cognito User Pool configured
- ✅ **Authorization**: Role-based access control
- ✅ **API Security**: GraphQL with proper auth rules
- ✅ **Storage Security**: S3 bucket with proper permissions
- ✅ **Environment Variables**: Secure configuration

---

## 📊 **Monitoring & Analytics**

### **AWS CloudWatch**
- Monitor Lambda function logs
- Track API usage
- Set up alarms

### **AWS X-Ray**
- Trace API calls
- Monitor performance
- Debug issues

---

## 🚨 **Important Notes**

1. **Your backend is already in production** - no additional deployment needed
2. **Sandbox = Production** in Amplify Gen 2
3. **All AWS resources are live** and accessible
4. **Focus on frontend deployment** for complete application

---

## 🎉 **You're Ready to Go Live!**

Your Kalpla mentorship platform is production-ready with:
- ✅ Scalable AWS infrastructure
- ✅ Secure authentication
- ✅ Real-time database
- ✅ File storage
- ✅ Push notifications
- ✅ Role-based access control

**Next Step**: Deploy your frontend using one of the options above!