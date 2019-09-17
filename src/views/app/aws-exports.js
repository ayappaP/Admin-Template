import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    identityPoolId: "eu-west-2:e80e6772-c132-455e-9792-e01c8d12ced7",
    region: "eu-west-2",
    identityPoolRegion: "eu-west-2",
    userPoolId: "eu-west-2_DkOsfcXsa",
    userPoolWebClientId: "4jo2jdl8o2vevrh21dlpqa40ri"
  }
});

export default Amplify;
