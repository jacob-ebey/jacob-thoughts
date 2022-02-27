let js = String.raw;

export function PageViews({ metricsKey }: { metricsKey: string }) {
  return (
    <>
      <p id="page-views">Total Views: ...</p>
      <script
        async
        src={`https://api.countapi.xyz/get/${metricsKey}?callback=cb`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: js`
            function cb(data) {
              document.getElementById("page-views").innerText = "Total Views: " + data.value;
            }
          `,
        }}
      />
    </>
  );
}
