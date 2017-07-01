echo "resource \"aws_instance\" \"${1}\" {
  ami           = \"ami-2757f631\"
  instance_type = \"t2.micro\"
}" > "instance_tfs/${1}.tf"
