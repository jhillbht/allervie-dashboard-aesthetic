# Deploying Allervie Dashboard to DigitalOcean

This guide covers the deployment process for the Allervie Dashboard application to DigitalOcean's App Platform.

## Prerequisites

1. DigitalOcean Account
2. GitHub repository connected to DigitalOcean
3. Supabase project and credentials
4. Node.js 18.19.0 and npm 10.2.3

## Deployment Steps

### 1. Environment Variables

Set up the following environment variables in DigitalOcean:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### 2. Deploy via DigitalOcean Console

1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Select "GitHub" as source
4. Choose the `allervie-dashboard` repository
5. Select the `main` branch
6. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Output Directory: `dist`

### 3. Health Check Configuration

The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "healthy"
}
```

Configure health checks in DigitalOcean:
- HTTP Path: `/health`
- Initial Delay: 10s
- Period: 30s

### 4. Database Configuration

1. Create a development database:
```bash
# From App Platform > Settings > Database
Select "db-s-dev-database"
Version: 12
```

2. Configure database credentials in environment variables.

### 5. Monitoring Setup

The application comes with built-in monitoring:

1. Application Metrics
   - CPU usage
   - Memory usage
   - Request count
   - Response times

2. Alert Policies
   - Deployment failures
   - High CPU utilization (>80%)
   - Error rate spikes

### 6. Scaling Configuration

Initial configuration:
- Instance Size: basic-xs
- Instance Count: 1

To scale:
1. Go to App Platform > Settings > Resources
2. Adjust instance size or count as needed

### 7. Custom Domain Setup

After successful deployment:
1. Go to App Platform > Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL will be automatically provisioned

## Post-Deployment Verification

1. Check application health:
```bash
curl https://your-app-url/health
```

2. Verify Supabase connection:
- Log in to the dashboard
- Check real-time updates
- Verify database queries

3. Monitor logs:
- App Platform > your-app > Logs
- Check for any errors or warnings

## Troubleshooting

Common issues and solutions:

1. Build Failures
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json
   - Review build logs in App Platform

2. Runtime Errors
   - Check environment variables
   - Verify Supabase connection
   - Review application logs

3. Performance Issues
   - Monitor resource usage
   - Check for memory leaks
   - Review database query performance

## Support

For deployment issues:
1. Check DigitalOcean status page
2. Review App Platform documentation
3. Contact support with build ID and logs

## Security Notes

1. Environment Variables
   - Mark all sensitive values as "Encrypted"
   - Use separate values for staging/production

2. Access Control
   - Configure proper CORS settings
   - Set up rate limiting
   - Enable request logging