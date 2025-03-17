import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";


interface Client {
  ip?: string;
  platform?: string;
  browser?: string;
  language?: string;
  timezone?: string;
  userAgent?: string;
  screenResolution?: {
    width?: number;
    height?: number;
  };
  windowResolution?: {
    width?: number;
    height?: number;
  };
  acceptLanguage?: string;
  host?: string;
  referer?: string;
  webdriver?: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number | string;
  location?: {
    city?: string;
    regionName?: string;
    country?: string;
    zip?: string;
    areaTimezone?: string;
    currency?: string;
    lat?: number;
    lon?: number;
  };
  isp: {
    asname?: string;
    isp?: string;
    org?: string;
    proxy?: boolean;
    mobile?: boolean;
  };
}

export default function ClientInfoPage() {
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery<Client>({
    queryKey: ['client-info'],
    queryFn: async () => {
      const ipData = await fetch("https://api.ipify.org?format=json");
      const response = await ipData.json();

      const ipLocation = await fetch(`http://ip-api.com/json/${response.ip}`);
      const locResponse = await ipLocation.json();

      console.log('ipData', response);
      console.log('locResponse', locResponse);
      console.log('navigator', navigator);

      // Detect browser from user agent
      const getBrowser = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
        return 'Unknown';
      };

      return {
        ip: response.ip,
        location: {
          city: locResponse.city,
          regionName: locResponse.regionName,
          country: locResponse.country,
          zip: locResponse.zip,
          areaTimezone: locResponse.timezone,
          currency: locResponse.currency,
          lat: locResponse.lat,
          lon: locResponse.lon,
        },
        isp: {
          isp: locResponse.isp,
          org: locResponse.org,
          proxy: locResponse.proxy,
          mobile: locResponse.mobile,
          asname: locResponse.asname,
        },
        platform: navigator.platform,
        browser: getBrowser(),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userAgent: navigator.userAgent,
        screenResolution: {
          width: screen.width,
          height: screen.height
        },
        windowResolution: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        acceptLanguage: navigator.languages.join(','),
        host: window.location.host,
        referer: document.referrer,
        webdriver: navigator.webdriver || false,
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        deviceMemory: 'Not available'
      };
    }
  });

  const Header = ({ title }: { title: string }) => (
    <>
      <div className="font-medium text-xl font-bold">{title}</div>
      <div className="font-medium text-xl"></div>
    </>
  )

  const Divider = () => <div className="col-span-2 my-2 border-t border-gray-200 dark:border-gray-700"></div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>My client information</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
          </div>
        ) : isError ? (
          <div className="text-red-500">
            <p>Error loading client information: {isError}</p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['client-info'] })}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">

              <Header title="Main" />

              <div className="font-medium">IP Address:</div>
              <div>{data?.ip || 'Not available'}</div>

              <div className="font-medium">Platform:</div>
              <div>{data?.platform || 'Not available'}</div>

              <div className="font-medium">Browser:</div>
              <div>{data?.browser || 'Not available'}</div>

              <Divider />

              <Header title="Location" />

              <div className="font-medium">City:</div>
              <div>{data?.location?.city}, {data?.location?.regionName}, {data?.location?.country}</div>

              <div className="font-medium">Zip:</div>
              <div>{data?.location?.zip}</div>

              <Divider />

              <Header title="Locale" />

              <div className="font-medium">Language:</div>
              <div>{data?.language}</div>

              <div className="font-medium">Timezone:</div>
              <div>{data?.timezone}</div>

              <div className="font-medium">Accept-Language:</div>
              <div className="truncate text-xs">{data?.acceptLanguage}</div>

              <Divider />

              <Header title="ISP" />

              <div className="font-medium">Name:</div>
              <div>{data?.isp?.isp}</div>

              <div className="font-medium">Org:</div>
              <div>{data?.isp?.org}</div>

              <div className="font-medium">AS Name:</div>
              <div>{data?.isp?.asname}</div>

              <div className="font-medium">Proxy:</div>
              <div className="truncate text-xs">{data?.isp?.proxy ? 'Yes' : 'No'}</div>

              <div className="font-medium">Mobile:</div>
              <div className="truncate text-xs">{data?.isp?.mobile ? 'Yes' : 'No'}</div>


              <Divider />

              <Header title="User Agent" />

              <div className="font-medium">User Agent:</div>
              <div className="truncate text-xs">{data?.userAgent}</div>

              <Divider />

              <Header title="Screen size" />

              <div className="font-medium">Screen Resolution:</div>
              <div>{data?.screenResolution?.width} x {data?.screenResolution?.height}</div>

              <div className="font-medium">Window Size:</div>
              <div>{data?.windowResolution?.width} x {data?.windowResolution?.height}</div>

              <Divider />

              <Header title="Hardware" />

              <div className="font-medium">Cores:</div>
              <div>{data?.hardwareConcurrency}</div>

              <Divider />

              <Header title="Host" />

              <div className="font-medium">Host:</div>
              <div>{data?.host}</div>

              <div className="font-medium">Referer:</div>
              <div className="truncate text-xs">{data?.referer}</div>

              <div className="font-medium">Using webdriver?:</div>
              <div className="truncate text-xs">{data?.webdriver ? 'Yes' : 'No'}</div>

            </div>

            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['client-info'] })}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}