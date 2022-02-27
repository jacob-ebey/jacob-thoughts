let js = String.raw;

export function PageViews({ metricsKey }: { metricsKey: string }) {
  let callbackName = `${metricsKey.replace(/[\/-]/g, "_")}Callback`;

  return (
    <>
      <p id={metricsKey}>Total Views: ...</p>
      <script
        async
        src={`https://api.countapi.xyz/get/${metricsKey}?callback=${callbackName}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: js`
            function ${callbackName}(data) {
              document.getElementById(${JSON.stringify(
                metricsKey
              )}).innerText = "Total Views: " + data.value;
            }
          `,
        }}
      />
    </>
  );
}
