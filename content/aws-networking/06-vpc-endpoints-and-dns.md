# VPC endpoints and private DNS

Much of the traffic a private subnet generates never needs to leave
AWS. **VPC endpoints** keep it inside, which removes a NAT gateway, cuts
latency, and removes the internet from the path of an API call.

## Interface endpoints

An **interface endpoint** creates elastic network interfaces with private
IP addresses in subnets you choose, and they front an AWS service such
as SSM, Secrets Manager, the API Gateway, or the Bedrock runtime. Traffic
to the service resolves to the endpoint's private address and stays on
the AWS network.

You attach a **security group** to the endpoint, and it behaves like a
NIC in the subnet: the same rules, the same routing, the same answer to
"is this reachable".

## Gateway endpoints and endpoint policies

A **gateway endpoint** is the other kind: it has no network interfaces
and no private addresses, and instead adds a route to the route tables
you choose, pointing at a prefix list of the service's addresses.
Gateway endpoints are free and currently cover S3 and DynamoDB.

An **endpoint policy** is attached to the endpoint and acts as a second
filter, like a bucket policy for anything arriving through it. A common
pattern restricts an S3 gateway endpoint to a handful of buckets and
denies everything else, so a compromised instance cannot use the endpoint
to read arbitrary buckets.

> An S3 **gateway endpoint** costs nothing and adds a route to the
> selected route tables; it exposes no private addresses of its own.

## Route 53 and private DNS

Inside a VPC, instances resolve names through Amazon's DNS resolver,
which honours **Route 53 private hosted zones**. A private hosted zone
with the same name as a public zone shadows it for everything inside the
VPC, which is how internal names such as `api.internal.example.com`
resolve without touching the public internet.

For interface endpoints, enabling **private DNS** makes the endpoint's
hostname resolve to its private addresses inside the VPC, so applications
can use the familiar service hostname — `ssm.us-east-1.amazonaws.com` —
and still stay on the private network.

The **resolver endpoint** extends the same behaviour to on-premises: an
outbound endpoint forwards queries from the VPC to corporate DNS, and an
inbound endpoint lets corporate DNS query the VPC's private zones.

> A **private hosted zone** shadows the public zone of the same name for
> every resolver inside the VPC.
